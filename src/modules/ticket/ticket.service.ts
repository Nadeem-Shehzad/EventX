import { BadRequestException, Injectable } from "@nestjs/common";
import { TicketRepository } from "./ticket.repository";
import { CreateTicketDTO } from "./dto/request/create-ticket.dto";
import { ClientSession } from "mongoose";


@Injectable()
export class TicketService {

   constructor(private readonly ticketRepo: TicketRepository) { }


   async createTickets(tickets: CreateTicketDTO[], session: ClientSession) {
      return await this.ticketRepo.createTickets(tickets, session);
   }


   async reserveTickets(ticketTypeId: string, quantity: number, session?: ClientSession) {
      const ticketType = await this.ticketRepo.ticketReserve(ticketTypeId, quantity, session);

      if (!ticketType) {
         throw new BadRequestException('Tickets not available');
      }

      return ticketType;
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