import { ICommandHandler } from "@nestjs/cqrs";
import { ReleasedReservedTicketCommand } from "../../commands/ticket.commands";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";
export declare class ReleaseReservedTicketHandler implements ICommandHandler<ReleasedReservedTicketCommand> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(command: ReleasedReservedTicketCommand): Promise<import("../../../schema/ticket-type.schema").TicketTypeDocument>;
}
