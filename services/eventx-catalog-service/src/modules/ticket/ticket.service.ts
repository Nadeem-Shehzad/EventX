import { Injectable } from "@nestjs/common";
import { TicketRepository } from "./ticket.repository";
import { CreateTicketDTO } from "./dto/request/create-ticket.dto";
import { ClientSession } from "mongoose";
import { CommandBus } from "@nestjs/cqrs";
import { 
   ConfirmTicketCommand, 
   ReleasedReservedTicketCommand, 
   ReserveTicketCommand 
} from "./cqrs/commands/ticket.commands";


@Injectable()
export class TicketService {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly commandBus: CommandBus
   ) { }


   async createTickets(tickets: CreateTicketDTO[], session: ClientSession) {
      return await this.ticketRepo.createTickets(tickets, session);
   }


   async reserveTickets(ticketTypeId: string, quantity: number, session?: ClientSession) {
      return this.commandBus.execute(
         new ReserveTicketCommand(ticketTypeId, quantity, session)
      );
   }


   async confirmReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession) {
      return this.commandBus.execute(
         new ConfirmTicketCommand(ticketTypeId, quantity, session)
      );
   }

   
   async releaseReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession) {
      return this.commandBus.execute(
         new ReleasedReservedTicketCommand(ticketTypeId, quantity, session)
      );
   }


   async saveTickets(tickets: CreateTicketDTO, session: ClientSession) {
      return await this.ticketRepo.saveTicket(tickets, session);
   }


   async findTicketById(id: string, session: ClientSession) {
      return await this.ticketRepo.findById(id, session);
   }


   async findOne(eventId: string, name: string, ticketTypeId: string, session: ClientSession) {
      return await this.ticketRepo.findOne(eventId, name, ticketTypeId, session);
   }


   async findOne2(eventId: string, name: string, session: ClientSession) {
      return await this.ticketRepo.findOne2(eventId, name, session);
   }


   async updateOne(id: string, ticketType: any, sold: number, reserved: number, existingTicket: any, session: ClientSession) {
      return await this.ticketRepo.updateOne(id, ticketType, sold, reserved, existingTicket, session);
   }


   async deleteManyTickets(eventId: string, session: ClientSession) {
      return await this.ticketRepo.deleteManyTickets(eventId, session);
   }
}