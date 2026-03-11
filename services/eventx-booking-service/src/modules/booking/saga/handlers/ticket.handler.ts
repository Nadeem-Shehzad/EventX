import { Injectable, Logger } from "@nestjs/common";
import {
   BookingConfirmedRequestPayload,
   BookingCreatedPayload,
   PaymentRequestPayload,
   TicketsReservedFailedPayload,
   TicketsReservedPayload,
   TicketsSoldPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class TicketsBookingHandler {

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }


   async handleTicketsReserved(data: TicketsReservedPayload) {

      const { bookingId, quantity, price } = data;

      this.logger.info({
         module: 'Booking',
         service: TicketsBookingHandler.name,
         msg: 'Inside handleTicketRserved',
         bookingId: data.bookingId
      });

      try {

         const payload: PaymentRequestPayload = {
            userId: data.userId.toString(),
            bookingId,
            amount: quantity * price,
            currency: 'PKR'
         }

         await this.emit(DOMAIN_EVENTS.PAYMENT_REQUEST, bookingId, payload);

      } catch (error) {
         throw error;
      }
   }


   async handleTicketsFailed(data: TicketsReservedFailedPayload) {

      this.logger.info({
         module: 'Booking',
         service: TicketsBookingHandler.name,
         msg: 'Inside handleTicketsFailed',
      });

      console.log('---------------- INSIDE HANDLE-TICKETS-FAILED --------------');

      const { bookingId, reason } = data;
      await this.bookingService.bookingFailed(bookingId);
   }


   async handleTicketsReservationFailed(data: TicketsReservedFailedPayload) {

      this.logger.info({
         module: 'Booking',
         service: TicketsBookingHandler.name,
         msg: 'Inside handleTicketsFailed',
      });

      console.log('---------------- INSIDE HANDLE-TICKETS-RESERVATION-FAILED --------------');

      //const { bookingId, reason } = data;
      //await this.bookingService.bookingFailed(bookingId);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.PAYMENT, aggregateId, event, payload);
   }
}