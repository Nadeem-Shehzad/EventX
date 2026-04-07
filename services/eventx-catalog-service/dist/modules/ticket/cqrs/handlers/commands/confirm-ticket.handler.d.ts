import { ICommandHandler } from "@nestjs/cqrs";
import { ConfirmTicketCommand } from "../../commands/ticket.commands";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";
export declare class ConfirmTicketHandler implements ICommandHandler<ConfirmTicketCommand> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(command: ConfirmTicketCommand): Promise<import("../../../schema/ticket-type.schema").TicketTypeDocument>;
}
