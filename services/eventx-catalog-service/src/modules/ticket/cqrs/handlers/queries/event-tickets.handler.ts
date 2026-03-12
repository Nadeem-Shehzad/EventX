import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTicketsByEventQuery } from "../../queries/ticket.queries";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";


@QueryHandler(GetTicketsByEventQuery)
export class GetTicketsByEventHandler implements IQueryHandler<GetTicketsByEventQuery> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(query: GetTicketsByEventQuery) {

      const { eventId } = query;

      console.log(`====================================`);
      console.log(`== INSIDE TICKET BY EVENT HANDLER ==`);
      console.log(`====================================`);

      const chacheKey = `tickets:event:${eventId}`;

      const chache = await this.redis.get(chacheKey);
      if (chache) {
         console.log('inside cahche');
         return JSON.parse(chache);
      }

      console.log('outside cahche');

      const tickets = await this.ticketRepo.findTicketsByEventID(eventId);

      await this.redis.set(
         chacheKey,
         JSON.stringify(tickets),
         10
      );

      return tickets;
   }
}