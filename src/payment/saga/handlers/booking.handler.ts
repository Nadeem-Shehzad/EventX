import { Injectable, Logger } from "@nestjs/common";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { BookingConfirmedFailedPayload, BookingConfirmedRequestPayload, PaymentFailedPayload, PaymentRequestPayload } from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { PaymentService } from "src/payment/payment.service";


@Injectable()
export class BookingPaymentHandler {

   private readonly logger = new Logger(BookingPaymentHandler.name);

   constructor(
      private readonly paymentService: PaymentService,
      private readonly outboxService: OutboxService
   ) { }


   async handleBookingPaymentRequest(data: PaymentRequestPayload) {

      this.logger.warn('Inside handleBookingPaymentRequest in Payment-Module');

      let paymentData: { paymentIntentId: string; clientSecret: string | null } | null = null;

      // paymentData = await this.paymentService.initiatePayment({
      //    bookingId: data.bookingId,
      //    amount: data.amount,
      //    currency: data.currency
      // });

      const payload: BookingConfirmedRequestPayload = {
         bookingId: data.bookingId,
         paymentIntent: ''//paymentData.paymentIntentId
      }

      //await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, data.bookingId, payload);
      await this.emit(DOMAIN_EVENTS.PAYMENT_FAILED, data.bookingId, payload);
   }


   async handleBookingPaymentFailed(data: PaymentFailedPayload) {

      this.logger.warn('Inside handleBookingPaymentFailed in Payment-Module');

      const payload: BookingConfirmedFailedPayload = {
         bookingId: data.bookingId,
      }

      await this.emit(DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED, data.bookingId, payload);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}