import {
   BadRequestException, forwardRef,
   Inject, Injectable
} from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BookingService } from "src/modules/booking/booking.service";
import { PaymentStatus } from "src/constants/payment-status.enum";
import { StripeService } from "src/stripe/stripe.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EmailJob } from "src/constants/email-queue.constants";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class PaymentService {

   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly stripe: StripeService,
      @Inject(forwardRef(() => BookingService))
      private readonly bookingService: BookingService,
      private readonly eventEmitter: EventEmitter2,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }


   async initiatePayment(params: {
      bookingId: string;
      amount: number;
      currency: string;
   }) {

      const amountInCents = Math.round(params.amount * 100);

      const paymentIntent = await this.stripe.createPaymentIntent({
         amount: amountInCents,
         currency: params.currency.toLowerCase(),
         metadata: {
            bookingId: params.bookingId
         }
      });

      return {
         paymentIntentId: paymentIntent.id,
         clientSecret: paymentIntent.client_secret
      }
   }


   async testPayment(paymentIntentId: string) {
      return await this.stripe.confirmTestPayment(paymentIntentId);
   }


   async refundBookingPayment(bookingId: string) {

      const booking = await this.bookingService.getBookingById(bookingId);

      if (!booking || booking.paymentStatus !== 'SUCCEEDED' || !booking.paymentIntentId) {
         throw new BadRequestException('Booking not eligible for refund');
      }

      const refund = await this.stripe.refundPayment(booking.paymentIntentId);;

      return refund;
   }


   async refundEventPayment(eventId: string) {

      const refunds: Array<{ bookingId: any; refund: any }> = [];

      const bookings = await this.bookingService.findBookingsByEventIdAndPaymentStatus(eventId);

      for (const booking of bookings) {

         if (!booking.paymentIntentId) {
            continue;
         }

         const refund = await this.stripe.refundPayment(booking.paymentIntentId);

         booking.paymentStatus = PaymentStatus.REFUNDED;
         await booking.save();

         refunds.push({ bookingId: booking._id, refund });
      }

      return refunds;
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