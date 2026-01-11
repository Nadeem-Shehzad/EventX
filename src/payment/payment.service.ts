import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { BookingService } from "src/modules/booking/booking.service";
import { StripeService } from "src/stripe/stripe.service";


@Injectable()
export class PaymentService {
   constructor(
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
   

   async testPayment(paymentIntentId: string){
      return this.stripe.confirmTestPayment(paymentIntentId);
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
         default:
            this.logger.log(`Unhandled Stripe event: ${event.type}`);
      }
   }
}