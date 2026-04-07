import { ICommandHandler } from '@nestjs/cqrs';
import { ReserveTicketCommand } from '../../commands/ticket.commands';
import { TicketRepository } from 'src/modules/ticket/ticket.repository';
import { RedisService } from 'src/redis/redis.service';
export declare class ReserveTicketHandler implements ICommandHandler<ReserveTicketCommand> {
    private readonly ticketRepo;
    private readonly redis;
    constructor(ticketRepo: TicketRepository, redis: RedisService);
    execute(command: ReserveTicketCommand): Promise<import("../../../schema/ticket-type.schema").TicketTypeDocument>;
}
