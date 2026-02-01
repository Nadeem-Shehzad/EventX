import { Injectable, Logger } from "@nestjs/common";
import { BookingCreatedPayload, TicketsReservedPayload } from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";


@Injectable()
export class BookingTicketHandler {

   private readonly logger = new Logger(BookingTicketHandler.name);

   constructor(
      private readonly ticketService: TicketService,
      private readonly outboxService: OutboxService
   ) { }

   async handleBookingCreated(data: BookingCreatedPayload) {

      this.logger.log('Inside BookingCreated Handler in Ticket-module');

      const { bookingId, ticketTypeId, quantity } = data;

      const ticket = await this.ticketService.reserveTickets(
         ticketTypeId,
         quantity,
         undefined
      );

      const payload: TicketsReservedPayload = {
         bookingId,
         isPaid: ticket.isPaidEvent,
         quantity
      }

      await this.emit(DOMAIN_EVENTS.TICKETS_RESERVED, bookingId, payload);
   }

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent('Ticket', aggregateId, event, payload);
   }
}