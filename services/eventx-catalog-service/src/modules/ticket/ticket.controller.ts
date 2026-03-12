import { Controller, Get, Param, Query } from "@nestjs/common";
import { TicketService } from "./ticket.service";


@Controller({ path: 'tickets', version: '1' })
export class TicketController {

   constructor(private readonly ticketService: TicketService) {}

   @Get('event/:eventId')
   async getTicketsByEvent(@Param('eventId') eventId: string) {
      return this.ticketService.getTicketsByEvent(eventId);
   }

   @Get(':ticketTypeId')
   async getTicketById(@Param('ticketTypeId') ticketTypeId: string) {
      return this.ticketService.getTicketByID(ticketTypeId);
   }

   @Get(':ticketTypeId/availability')
   async checkAvailability(
      @Param('ticketTypeId') ticketTypeId: string,
      @Query('quantity') quantity: number
   ) {
      return this.ticketService.checkAvailability(ticketTypeId, quantity);
   }
}