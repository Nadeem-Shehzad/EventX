import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CheckAvailabilityQuery } from '../../queries/ticket.queries';
import { TicketRepository } from 'src/modules/ticket/ticket.repository';
import { RedisService } from 'src/redis/redis.service';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(CheckAvailabilityQuery)
export class CheckAvailabilityHandler
   implements IQueryHandler<CheckAvailabilityQuery> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(query: CheckAvailabilityQuery) {

      const { ticketTypeId, quantity } = query;
      const cacheKey = `availability:ticket:${ticketTypeId}`;

      const cached = await this.redis.get(cacheKey);
      if (cached !== null) {
         const available = parseInt(cached);
         return {
            available: available >= quantity,
            availableQuantity: available
         };
      }

      const ticket = await this.ticketRepo.findByIdNoSession(ticketTypeId);

      if (!ticket) {
         throw new NotFoundException('Ticket Not Found');
      }

      await this.redis.set(
         cacheKey,
         ticket.availableQuantity.toString(),
         60
      );

      return {
         available: ticket.availableQuantity >= quantity,
         availableQuantity: ticket.availableQuantity
      };
   }
}