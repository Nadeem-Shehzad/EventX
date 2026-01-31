import { Injectable, Logger } from "@nestjs/common";
import { BookingCreatedPayload } from "src/constants/events/booking-created.event";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";



@Injectable()
export class TicketsBookingHandler {

   private readonly logger = new Logger(TicketsBookingHandler.name);

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService
   ) { }


   async handleTicketsReserved(data: BookingCreatedPayload) {
      const { bookingId, userId, eventId, ticketTypeId, quantity } = data;

      this.logger.log('Inside TicketRserved Handler in Booking-module');

      try {
         // //2️⃣ Emit NEXT EVENT via OUTBOX
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
         //    DOMAIN_EVENTS.TICKETS_RESERVED,
         //    payload,
         //    undefined
         // );

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
}