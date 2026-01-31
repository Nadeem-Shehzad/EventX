import { Injectable, Logger } from "@nestjs/common";
import {
   BookingConfirmedRequestPayload,
   BookingCreatedPayload,
   PaymentRequestPayload,
   TicketsReservedPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AGGREGATES } from "src/constants/events/domain-aggregate";



@Injectable()
export class TicketsBookingHandler {

   private readonly logger = new Logger(TicketsBookingHandler.name);

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService
   ) { }


   async handleTicketsReserved(data: TicketsReservedPayload) {
      const { bookingId, isPaid, quantity } = data;

      this.logger.log('Inside TicketRserved Handler in Booking-module');

      try {

         if (!isPaid) {
            const payload: BookingConfirmedRequestPayload = { bookingId };
            await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, bookingId, payload);
         }


         this.logger.warn('--- This is Paid Event ---');
         //2️⃣ Emit NEXT EVENT via OUTBOX
         const payload: PaymentRequestPayload = {
            bookingId,
            amount: 10000,
            currency: 'PKR'
         }

         await this.emit(DOMAIN_EVENTS.PAYMENT_REQUEST, bookingId, payload);

      } catch (error) {
         // 3️⃣ Failure path → emit failure event
         // const payload: BookingCreatedPayload = {
         //    bookingId,
         //    userId,
         //    eventId,
         //    ticketTypeId,
         //    quantity
         // }

         // await this.outboxService.addEvent<BookingCreatedPayload>(
         //    'Booking',
         //    bookingId,
         //    DOMAIN_EVENTS.TICKETS_FAILED,
         //    payload,
         //    undefined
         // );

         throw error; // allow BullMQ retry
      }
   }


   async handleTicketsFailed(data: TicketsReservedPayload) {
      const { bookingId, isPaid, quantity } = data;

      this.logger.log('Inside handleTicketsFailed Handler in Booking-module');
      this.logger.log('--- Ticket Reservation Failed ---');
   }

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.PAYMENT, aggregateId, event, payload);
   }
}