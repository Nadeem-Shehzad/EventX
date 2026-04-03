import {
   BadRequestException, forwardRef,
   Inject, Injectable
} from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Types } from "mongoose";
import { BookingService } from "src/modules/booking/booking.service";
import { PaymentStatus } from "src/constants/payment-status.enum";
import { StripeService } from "src/stripe/stripe.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EmailJob } from "src/constants/email-queue.constants";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";
import { PaymentRepository } from "./payment.repo";
import CircuitBreaker from "opossum";
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";


@Injectable()
export class PaymentService {

   private readonly refundBreaker: CircuitBreaker;

   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly stripe: StripeService,
      private readonly paymentRepo: PaymentRepository,
      @Inject(forwardRef(() => BookingService))
      private readonly bookingService: BookingService,
      private readonly eventEmitter: EventEmitter2,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger,
      private readonly circuitBreakerService: CircuitBreakerService,
   ) {
      // 👇 one breaker wraps stripe.refundPayment
      // covers both refundBookingPayment and refundEventPayment
      this.refundBreaker = this.circuitBreakerService.create(
         'stripe-refund',
         this.stripe.refundPayment.bind(this.stripe),
      );
   }


   async createPayment(params: {
      userId: string;
      bookingId: string;
      amount: number;
      currency: string;
   }) {

      //throw new Error('Stripe is down!');

      const existingPayment = await this.paymentRepo.findOne({
         bookingId: new Types.ObjectId(params.bookingId),
         status: {
            $in: [PaymentStatus.PENDING, PaymentStatus.COMPLETED]
         }
      });

      if (existingPayment) {
         return {
            paymentIntentId: existingPayment.stripePaymentIntentId,
            clientSecret: null
         };
      }

      const amountInCents = Math.round(params.amount * 100);

      const paymentIntent = await this.stripe.createPaymentIntent(
         {
            amount: amountInCents,
            currency: params.currency.toLowerCase(),
            metadata: {
               bookingId: params.bookingId,
               userId: params.userId
            }
         },
         params.bookingId
      );

      await this.paymentRepo.create({
         userId: new Types.ObjectId(params.userId),
         bookingId: new Types.ObjectId(params.bookingId),
         stripePaymentIntentId: paymentIntent.id,
         amount: params.amount,
         currency: params.currency,
         status: PaymentStatus.PENDING
      });

      return {
         paymentIntentId: paymentIntent.id,
         clientSecret: paymentIntent.client_secret
      };
   }


   async testPayment(paymentIntentId: string) {
      return await this.stripe.confirmTestPayment(paymentIntentId);
   }


   async refundBookingPayment(bookingId: string) {

      const booking = await this.bookingService.getBookingById(bookingId);

      if (!booking || booking.paymentStatus !== 'SUCCEEDED' || !booking.paymentIntentId) {
         throw new BadRequestException('Booking not eligible for refund');
      }

      try {
         const refund = await this.refundBreaker.fire(booking.paymentIntentId);

         this.logger.info({
            module: 'Payment',
            service: PaymentService.name,
            msg: `Refund successful for booking: ${bookingId}`,
         });

         return refund;

      } catch (error) {
         if (this.refundBreaker.opened) {
            this.logger.error({
               module: 'Payment',
               service: PaymentService.name,
               msg: '🔴 Refund circuit OPEN — Stripe refund service unavailable',
               bookingId,
            });

            throw error;
         }

         this.logger.error({
            module: 'Payment',
            service: PaymentService.name,
            msg: `Refund failed for booking: ${bookingId}`,
            error: error.message
         });

         throw error; // let BullMQ retry
      }
   }


   async refundEventPayment(eventId: string) {

      const refunds: Array<{ bookingId: any; refund: any }> = [];
      const failed: Array<{ bookingId: any; reason: string }> = [];

      const bookings = await this.bookingService.findBookingsByEventIdAndPaymentStatus(eventId);

      for (const booking of bookings) {

         if (!booking.paymentIntentId) continue;

         // 👇 circuit OPEN — no point trying remaining bookings
         // Stripe is down, stop the loop immediately
         if (this.refundBreaker.opened) {
            this.logger.error({
               module: 'Payment',
               service: PaymentService.name,
               msg: `🔴 Refund circuit OPEN — stopping bulk refund at booking: ${booking._id}`,
            });
            failed.push({ bookingId: booking._id, reason: 'Stripe refund service unavailable' });
            continue; // skip this booking, don't hang
         }

         try {
            const refund = await this.refundBreaker.fire(booking.paymentIntentId);

            booking.paymentStatus = PaymentStatus.REFUNDED;
            await booking.save();

            refunds.push({ bookingId: booking._id, refund });

         } catch (error) {
            this.logger.error({
               module: 'Payment',
               service: PaymentService.name,
               msg: `Refund failed for booking: ${booking._id}`,
               error: error.message
            });
            failed.push({ bookingId: booking._id, reason: error.message });
         }
      }

      return { refunds, failed }; // 👈 return both successful and failed refunds
   }


   async handleStripeWebhook(event: any) {
      switch (event.type) {

         case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const bookingId = paymentIntent.metadata.bookingId;

            await this.bookingService.confirmBookingRequest(bookingId);
            //await this.outboxService.addEvent();
            this.logger.info({
               module: 'Payment',
               service: 'handleStripeWebhook.payment_intent.succeeded',
               msg: `Booking ${bookingId} confirmed via payment_intent.succeeded`,
            });

            break;
         }

         case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const bookingId = paymentIntent.metadata.bookingId;

            await this.bookingService.cancelBookingRequest(bookingId);

            this.logger.error({
               module: 'Payment',
               service: 'handleStripeWebhook.payment_intent.payment_failed',
               msg: `Booking ${bookingId} cancelled due to payment failure`,
            });

            break;
         }

         case 'charge.refunded': {
            const refund = event.data.object;
            const paymentIntentId = refund.payment_intent;

            await this.bookingService.markBookingRefunded(paymentIntentId);

            this.logger.error({
               module: 'Payment',
               service: 'handleStripeWebhook.charge.refunded',
               msg: `Booking with ${paymentIntentId} refunded`,
            });

            break;
         }

         default:
            this.logger.error({
               module: 'Payment',
               service: 'handleStripeWebhook.default',
               msg: `Unhandled Stripe event: ${event.type}`,
            });
      }
   }
}