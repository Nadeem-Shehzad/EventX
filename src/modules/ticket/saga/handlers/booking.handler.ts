import { Injectable, Logger } from "@nestjs/common";
import { 
   BookingCreatedPayload, 
   TicketsReservedPayload 
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";
import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class BookingTicketHandler {

   constructor(
      private readonly ticketService: TicketService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }

   async handleBookingCreated(data: BookingCreatedPayload) {

      this.logger.info({
         module: 'Ticket',
         service: BookingTicketHandler.name,
         msg: 'Inside BookingCreated',
      });

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