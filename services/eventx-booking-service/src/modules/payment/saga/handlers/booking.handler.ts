import { Injectable, Logger } from "@nestjs/common";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import {
   BookingConfirmedFailedPayload,
   BookingConfirmedRequestPayload,
   PaymentFailedPayload,
   PaymentRequestPayload,
   TicketsSoldPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AppLogger } from "src/logging/logging.service";
import { OutboxService } from "src/outbox/outbox.service";
import { PaymentService } from "src/modules/payment/payment.service";
import CircuitBreaker from "opossum";
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";


@Injectable()
export class BookingPaymentHandler {

   private readonly breaker: CircuitBreaker;

   constructor(
      private readonly paymentService: PaymentService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger,
      private readonly circuitBreaker: CircuitBreakerService
   ) {
      this.breaker = this.circuitBreaker.create(
         'stripe-payment',
         this.paymentService.createPayment.bind(this.paymentService)
      );
   }


   async handleBookingPaymentRequest(data: PaymentRequestPayload) {

      this.logger.info({
         module: 'Payment',
         service: BookingPaymentHandler.name,
         msg: 'Inside handleBookingPaymentRequest',
         bookingId: data.bookingId,
      });

      //let paymentData: { paymentIntentId: string; clientSecret: string | null } | null = null;

      try {

         const paymentData = await this.breaker.fire({
            userId: data.userId,
            bookingId: data.bookingId,
            amount: data.amount,
            currency: data.currency
         }) as { paymentIntentId: string; clientSecret: string | null };

         const payload: TicketsSoldPayload = {
            bookingId: data.bookingId,
            paymentIntent: paymentData.paymentIntentId
         }

         await this.emit(DOMAIN_EVENTS.TICKET_SOLD, data.bookingId, payload);
         //await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, data.bookingId, payload);
         //await this.emit(DOMAIN_EVENTS.PAYMENT_FAILED, data.bookingId, payload);
      } catch (error) {

         // reaches here when:
         // 1. payment failed normally → BullMQ will retry the job
         // 2. circuit is OPEN → skip retries, trigger compensation immediately

         if (this.breaker.opened) {
            this.logger.error({
               module: 'Payment',
               service: BookingPaymentHandler.name,
               msg: '🔴 Circuit OPEN — triggering compensation immediately',
               bookingId: data.bookingId,
            });

            // payment provider is down → trigger SAGA compensation immediately
            // no point retrying — releases the reserved ticket back
            await this.emit(DOMAIN_EVENTS.PAYMENT_FAILED, data.bookingId, {
               bookingId: data.bookingId,
               reason: 'Payment service unavailable'
            });

            return; // skip BullMQ retry
         }

         // circuit is CLOSED — normal failure, let BullMQ retry the job
         this.logger.error({
            module: 'Payment',
            service: BookingPaymentHandler.name,
            msg: 'Payment failed — will retry',
            bookingId: data.bookingId,
            error: error.message
         });

         throw error; // 👈 rethrow so BullMQ retries the job
      }
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

      try {
         await this.paymentService.refundBookingPayment(data.bookingId);

         const payload = { bookingId: data.bookingId };
         await this.emit(DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED, data.bookingId, payload);

      } catch (error) {
         // refund failed or circuit open → rethrow so BullMQ retries later
         this.logger.error({
            module: 'Payment',
            service: BookingPaymentHandler.name,
            msg: 'Refund failed — will retry via BullMQ',
            bookingId: data.bookingId,
            error: error.message
         });

         throw error; // 👈 BullMQ retries the refund job
      }
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}