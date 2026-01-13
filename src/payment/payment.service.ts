import {
   BadRequestException, forwardRef,
   Inject, Injectable, Logger
} from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BookingService } from "src/modules/booking/booking.service";
import { PaymentStatus } from "src/modules/booking/enum/payment-status.enum";
import { StripeService } from "src/stripe/stripe.service";


@Injectable()
export class PaymentService {
   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly stripe: StripeService,
      @Inject(forwardRef(() => BookingService))
      private readonly bookingService: BookingService
   ) { }

   private readonly logger = new Logger(PaymentService.name);


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


   async refundPayment(bookingId: string) {

      const booking = await this.bookingService.getBookingById(bookingId);

      if (!booking || booking.paymentStatus !== 'SUCCEEDED' || !booking.paymentIntentId) {
         throw new BadRequestException('Booking not eligible for refund');
      }

      const refund = await this.stripe.refundPayment(booking.paymentIntentId);;

      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         booking.paymentStatus = PaymentStatus.REFUNDED;
         await booking.save({ session });

         await session.commitTransaction();

         return refund;

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   async handleStripeWebhook(event: any) {
      switch (event.type) {

         case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const bookingId = paymentIntent.metadata.bookingId;

            await this.bookingService.confirmBooking(bookingId);
            this.logger.log(`Booking ${bookingId} confirmed via payment_intent.succeeded`);

            break;
         }

         case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const bookingId = paymentIntent.metadata.bookingId;

            await this.bookingService.cancelBooking(bookingId);
            this.logger.log(`Booking ${bookingId} cancelled due to payment failure`);

            break;
         }

         case 'refund.succeeded': {
            const refund = event.data.object;
            const paymentIntentId = refund.payment_intent;

            await this.bookingService.markBookingRefunded(paymentIntentId);
            this.logger.log(`Booking with ${paymentIntentId} refunded`);

            break;
         }

         default:
            this.logger.log(`Unhandled Stripe event: ${event.type}`);
      }
   }
}