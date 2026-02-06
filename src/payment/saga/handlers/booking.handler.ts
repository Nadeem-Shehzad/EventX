import { Injectable, Logger } from "@nestjs/common";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import {
   BookingConfirmedFailedPayload,
   BookingConfirmedRequestPayload,
   PaymentFailedPayload,
   PaymentRequestPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AppLogger } from "src/logging/logging.service";
import { OutboxService } from "src/outbox/outbox.service";
import { PaymentService } from "src/payment/payment.service";


@Injectable()
export class BookingPaymentHandler {

   constructor(
      private readonly paymentService: PaymentService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }


   async handleBookingPaymentRequest(data: PaymentRequestPayload) {

      this.logger.info({
         module: 'Payment',
         service: BookingPaymentHandler.name,
         msg: 'Inside handleBookingPaymentRequest',
         bookingId: data.bookingId,
      });

      let paymentData: { paymentIntentId: string; clientSecret: string | null } | null = null;

      paymentData = await this.paymentService.initiatePayment({
         bookingId: data.bookingId,
         amount: data.amount,
         currency: data.currency
      });

      const payload: BookingConfirmedRequestPayload = {
         bookingId: data.bookingId,
         paymentIntent: paymentData.paymentIntentId
      }

      await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, data.bookingId, payload);
      //await this.emit(DOMAIN_EVENTS.PAYMENT_FAILED, data.bookingId, payload);
   }


   async handleBookingPaymentFailed(data: PaymentFailedPayload) {

      this.logger.info({
         module: 'Payment',
         service: BookingPaymentHandler.name,
         msg: 'Inside handleBookingPaymentFailed',
         bookingId: data.bookingId,
      });

      const payload: BookingConfirmedFailedPayload = { bookingId: data.bookingId }

      await this.emit(DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED, data.bookingId, payload);
   }


   async handleBookingPaymentRefundRequest(data: BookingConfirmedFailedPayload) {

      this.logger.info({
         module: 'Payment',
         service: BookingPaymentHandler.name,
         msg: 'Inside handleBookingPaymentRefundRequest',
         bookingId: data.bookingId,
      });

      await this.paymentService.refundBookingPayment(data.bookingId);

      const payload = { bookingId: data.bookingId };
      await this.emit(DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED, data.bookingId, payload);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}