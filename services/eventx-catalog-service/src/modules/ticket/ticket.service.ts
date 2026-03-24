import {
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { TicketRepository } from './ticket.repository';
import { CreateTicketDTO } from './dto/request/create-ticket.dto';
import { TicketTypeDocument } from './schema/ticket-type.schema';
import {
   ConfirmTicketCommand,
   ReleasedReservedTicketCommand,
   ReserveTicketCommand,
} from './cqrs/commands/ticket.commands';
import {
   CheckAvailabilityQuery,
   GetTicketByIdQuery,
   GetTicketsByEventQuery,
} from './cqrs/queries/ticket.queries';

@Injectable()
export class TicketService {

   private readonly logger = new Logger(TicketService.name);

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus,
   ) { }

   // ── Session-based writes (called from EventService transactions) ──

   async createTickets(tickets: CreateTicketDTO[], session: ClientSession): Promise<void> {
      await this.ticketRepo.createTickets(tickets, session);
      // throwDbException in repo handles all Mongo errors — no try/catch needed here
   }

   async saveTickets(ticket: CreateTicketDTO, session: ClientSession): Promise<TicketTypeDocument> {
      return this.ticketRepo.saveTicket(ticket, session);
   }

   async updateOne(
      id: string,
      ticketType: Partial<TicketTypeDocument>,
      sold: number,
      reserved: number,
      existingTicket: TicketTypeDocument,
      session: ClientSession
   ): Promise<void> {
      await this.ticketRepo.updateOne(id, ticketType, sold, reserved, existingTicket, session);
   }

   async deleteManyTickets(eventId: string, session: ClientSession): Promise<void> {
      await this.ticketRepo.deleteManyTickets(eventId, session);
   }

   // ── Session-based reads ───────────────────────────────────────

   async findTicketById(
      id: string,
      session: ClientSession
   ): Promise<TicketTypeDocument | null> {
      return this.ticketRepo.findById(id, session);
   }

   // Renamed from findOne — checks if another ticket already has this name (excludes self)
   async findConflictingTicketName(
      eventId: string,
      name: string,
      excludeTicketId: string,
      session: ClientSession
   ): Promise<TicketTypeDocument | null> {
      return this.ticketRepo.findConflictingTicketName(eventId, name, excludeTicketId, session);
   }

   // Renamed from findOne2 — checks if any ticket has this name (new ticket creation)
   async findTicketByName(
      eventId: string,
      name: string,
      session: ClientSession
   ): Promise<TicketTypeDocument | null> {
      return this.ticketRepo.findTicketByName(eventId, name, session);
   }

   // ── CQRS Commands — wrapped to produce typed errors ──────────

   async reserveTickets(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument> {
      try {
         const result = await this.commandBus.execute(
            new ReserveTicketCommand(ticketTypeId, quantity, session)
         );
         // null = not enough available quantity — command handler returns null
         if (!result) throw new NotFoundException('Ticket not available or insufficient quantity');
         return result;
      } catch (err) {
         if (err instanceof NotFoundException) throw err;
         this.logger.error(`reserveTickets failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to reserve tickets');
      }
   }

   async confirmReservedTickets(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument> {
      try {
         const result = await this.commandBus.execute(
            new ConfirmTicketCommand(ticketTypeId, quantity, session)
         );
         if (!result) throw new NotFoundException('Reserved tickets not found');
         return result;
      } catch (err) {
         if (err instanceof NotFoundException) throw err;
         this.logger.error(`confirmReservedTickets failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to confirm tickets');
      }
   }

   async releaseReservedTickets(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument> {
      try {
         const result = await this.commandBus.execute(
            new ReleasedReservedTicketCommand(ticketTypeId, quantity, session)
         );
         if (!result) throw new NotFoundException('Reserved tickets not found');
         return result;
      } catch (err) {
         if (err instanceof NotFoundException) throw err;
         this.logger.error(`releaseReservedTickets failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to release tickets');
      }
   }

   // ── CQRS Queries ──────────────────────────────────────────────

   async getTicketsByEvent(eventId: string) {
      try {
         return await this.queryBus.execute(new GetTicketsByEventQuery(eventId));
      } catch (err) {
         this.logger.error(`getTicketsByEvent failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to fetch tickets');
      }
   }

   async getTicketByID(ticketTypeId: string) {
      try {
         return await this.queryBus.execute(new GetTicketByIdQuery(ticketTypeId));
      } catch (err) {
         this.logger.error(`getTicketByID failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to fetch ticket');
      }
   }

   async checkAvailability(ticketTypeId: string, quantity: number) {
      try {
         return await this.queryBus.execute(
            new CheckAvailabilityQuery(ticketTypeId, quantity)
         );
      } catch (err) {
         this.logger.error(`checkAvailability failed: ${err.message}`);
         throw new InternalServerErrorException('Failed to check ticket availability');
      }
   }

   // ── Non-session reads ─────────────────────────────────────────

   async findTicketsByEvent(eventId: string): Promise<TicketTypeDocument[]> {
      return this.ticketRepo.findTicketsByEventId(eventId);
      // safeQuery with fallback:[] in repo — never throws
   }

   async findByIdNoSession(id: string): Promise<TicketTypeDocument | null> {
      return this.ticketRepo.findByIdNoSession(id);
   }
}