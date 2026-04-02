import { Injectable, NotFoundException } from "@nestjs/common";
import {
   BookingConfirmedRequestPayload,
   TicketsReservedPayload,
   TicketsSoldPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";
//import { AppLogger } from "src/logging/logging.service";
import { BookingClient } from "src/clients/booking/booking.client";


@Injectable()
export class TicketHandler {

   constructor(
      private readonly ticketService: TicketService,
      private readonly outboxService: OutboxService,
      //private readonly logger: AppLogger,
      private readonly bookingClient: BookingClient
   ) { }

   async handleTicketSold(data: TicketsSoldPayload) {

      // this.logger.info({
      //    module: 'Ticket',
      //    service: TicketHandler.name,
      //    msg: 'Inside TicketSold',
      //    //eventId: data.eventId,
      //    bookingId: data.bookingId,
      // });

      try {

         const { bookingId } = data;

         const bookingResponse = await this.bookingClient.findBookingById(bookingId);

         if (!bookingResponse) {
            throw new NotFoundException('TicketSold ::: Booking Not Found');
         }

         const booking = bookingResponse.data;

         const ticket = await this.ticketService.confirmReservedTickets(
            booking.ticketTypeId,
            booking.quantity,
            undefined
         );

         const payload: BookingConfirmedRequestPayload = { bookingId };
         await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, bookingId, payload);

      } catch (error) {
         
         console.log('===============');
         console.log(error.message);
         console.log('===============');

         const { bookingId } = data;
         await this.emit(DOMAIN_EVENTS.TICKET_SOLD_FAILED, bookingId, null);
      }
   }

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent('Ticket', aggregateId, event, payload);
   }
}