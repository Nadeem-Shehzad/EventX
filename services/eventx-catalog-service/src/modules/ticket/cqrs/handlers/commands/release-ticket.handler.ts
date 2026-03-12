import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReleasedReservedTicketCommand } from "../../commands/ticket.commands";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { RedisService } from "src/redis/redis.service";
import { BadRequestException } from "@nestjs/common";


@CommandHandler(ReleasedReservedTicketCommand)
export class ReleaseReservedTicketHandler implements ICommandHandler<ReleasedReservedTicketCommand> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(command: ReleasedReservedTicketCommand) {

      const { ticketTypeId, quantity, session } = command;

      const ticketType = await this.ticketRepo.releaseReservedTickets(
         ticketTypeId,
         quantity,
         session,
      );

      if (!ticketType) {
         throw new BadRequestException('Reserved tickets not found');
      }

      await this.redis.incrby(
         `availability:ticket:${ticketTypeId}`,
         quantity
      );

      await this.redis.del(
         `tickets:event:${ticketType.eventId.toString()}`
      );

      return ticketType;
   }
}