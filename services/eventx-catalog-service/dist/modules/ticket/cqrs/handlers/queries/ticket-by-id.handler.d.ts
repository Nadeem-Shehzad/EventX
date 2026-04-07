import { IQueryHandler } from "@nestjs/cqrs";
import { GetTicketByIdQuery } from "../../queries/ticket.queries";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";
export declare class TicketByIDHandler implements IQueryHandler<GetTicketByIdQuery> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(query: GetTicketByIdQuery): Promise<any>;
}
