import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmTicketCommand } from "../../commands/ticket.commands";
import { TicketRepository } from "src/modules/ticket/ticket.repository";
import { BadRequestException } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { RedisService } from "src/redis/redis.service";


@CommandHandler(ConfirmTicketCommand)
export class ConfirmTicketHandler implements ICommandHandler<ConfirmTicketCommand> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(command: ConfirmTicketCommand) {
      
      const { ticketTypeId, quantity, session } = command;

      const ticketType = await this.ticketRepo.confirmReservedTickets(
         ticketTypeId,
         quantity,
         session,
      );

      if (!ticketType) {
         throw new BadRequestException('Reserved tickets not found');
      }

      await this.redis.del(
         `tickets:event:${ticketType.eventId.toString()}`
      );

      return ticketType;
   }
}