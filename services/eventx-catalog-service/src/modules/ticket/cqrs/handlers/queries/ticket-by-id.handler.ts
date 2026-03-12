import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTicketByIdQuery } from "../../queries/ticket.queries";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";



@QueryHandler(GetTicketByIdQuery)
export class TicketByIDHandler implements IQueryHandler<GetTicketByIdQuery> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(query: GetTicketByIdQuery) {

      const { ticketTypeId } = query;

      console.log(`=================================`);
      console.log(`== INSIDE TICKET BY ID HANDLER ==`);
      console.log(`=================================`);

      const chacheKey = `ticket:${ticketTypeId}`;

      const chache = await this.redis.get(chacheKey);
      if (chache) {
         return JSON.parse(chache);
      }

      const ticket = await this.ticketRepo.findByIdNoSession(ticketTypeId);

      await this.redis.set(
         chacheKey,
         JSON.stringify(ticket),
         300
      );

      return ticket;
   }
}