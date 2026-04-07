import { IQueryHandler } from '@nestjs/cqrs';
import { CheckAvailabilityQuery } from '../../queries/ticket.queries';
import { TicketRepository } from 'src/modules/ticket/ticket.repository';
import { RedisService } from 'src/redis/redis.service';
export declare class CheckAvailabilityHandler implements IQueryHandler<CheckAvailabilityQuery> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(query: CheckAvailabilityQuery): Promise<{
        available: boolean;
        availableQuantity: number;
    }>;
}
