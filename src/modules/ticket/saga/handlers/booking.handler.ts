import { Injectable, Logger } from "@nestjs/common";
import { BookingCreatedPayload } from "src/constants/events/booking-created.event";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";


@Injectable()
export class BookingTicketHandler {

   private readonly logger = new Logger(BookingTicketHandler.name);
   constructor(private readonly outboxService: OutboxService) { }

   async handleBookingCreated(data: BookingCreatedPayload) {

      this.logger.log('Inside BookingCreated Handler in Ticket-module');

      const { bookingId, userId, eventId, ticketTypeId, quantity } = data;

      try {
         // 1️⃣ Apply ticket business rules
         // await this.ticketService.reserveTickets(
         //    ticketTypeId,
         //    quantity,
         //    undefined
         // );

         //2️⃣ Emit NEXT EVENT via OUTBOX
         const payload: BookingCreatedPayload = {
            bookingId,
            userId,
            eventId,
            ticketTypeId,
            quantity
         }

         await this.outboxService.addEvent<BookingCreatedPayload>(
            'Booking',
            bookingId,
            DOMAIN_EVENTS.TICKETS_RESERVED,
            payload,
            undefined
         );

      } catch (error) {

         // 3️⃣ Failure path → emit failure event
         const payload: BookingCreatedPayload = {
            bookingId,
            userId,
            eventId,
            ticketTypeId,
            quantity
         }

         await this.outboxService.addEvent<BookingCreatedPayload>(
            'Booking',
            bookingId,
            DOMAIN_EVENTS.TICKETS_FAILED,
            payload,
            undefined
         );

         throw error; // allow BullMQ retry
      }

   }
}