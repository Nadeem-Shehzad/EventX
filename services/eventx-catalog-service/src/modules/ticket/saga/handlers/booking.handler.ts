import { Injectable } from "@nestjs/common";
import {
   BookingCreatedPayload,
   TicketsReservedPayload,
   TicketsSoldPayload

} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";
//import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class BookingTicketHandler {

   constructor(
      private readonly ticketService: TicketService,
      private readonly outboxService: OutboxService,
      //private readonly logger: AppLogger,
   ) {}

   async handleBookingCreated(data: BookingCreatedPayload) {

      // this.logger.info({
      //    module: 'Ticket',
      //    service: BookingTicketHandler.name,
      //    msg: 'Inside BookingCreated',
      //    eventId: data.eventId,
      //    bookingId: data.bookingId,
      //    ticketId: data.ticketTypeId
      // });

      try {
         const { userId, bookingId, ticketTypeId, quantity } = data;

         
         const ticket = await this.ticketService.reserveTickets(
            ticketTypeId,
            quantity,
            undefined
         );
         
         // const ticket = await this.ticketBreaker.fire(
         //    ticketTypeId,
         //    quantity,
         //    undefined) as any;

         const payload: TicketsReservedPayload = {
            userId,
            bookingId,
            ticketTypeId,
            isPaid: ticket.isPaidEvent,
            quantity,
            price: ticket.price
         }

         if (!ticket.isPaidEvent) {
            const payload: TicketsSoldPayload = { bookingId };
            await this.emit(DOMAIN_EVENTS.TICKET_SOLD, bookingId, payload);

         } else {
            await this.emit(DOMAIN_EVENTS.TICKET_RESERVED, bookingId, payload);
         }

      } catch (error) {

         // this.logger.error({
         //    module: 'Ticket',
         //    service: BookingTicketHandler.name,
         //    msg: `Ticket reservation failed: ${error.message}`,
         //    bookingId: data.bookingId,
         // });

         const { bookingId } = data;
         await this.emit(DOMAIN_EVENTS.TICKET_RESERVATION_FAILED, bookingId, { bookingId });
         //await this.emit(DOMAIN_EVENTS.TICKET_RESERVATION_FAILED, bookingId, null);

         // why not throw here ... means do i have retry logic here or just go to compensation
         // on first failure? so implement here retry logic also
      }
   }

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent('Ticket', aggregateId, event, payload);
   }
}