import { IQueryHandler } from "@nestjs/cqrs";
import { GetTicketsByEventQuery } from "../../queries/ticket.queries";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";
export declare class GetTicketsByEventHandler implements IQueryHandler<GetTicketsByEventQuery> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(query: GetTicketsByEventQuery): Promise<any>;
}
