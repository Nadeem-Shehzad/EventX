import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReserveTicketCommand } from '../../commands/ticket.commands';
import { TicketRepository } from 'src/modules/ticket/ticket.repository';
import { RedisService } from 'src/redis/redis.service';
import { BadRequestException } from '@nestjs/common';


@CommandHandler(ReserveTicketCommand)
export class ReserveTicketHandler implements ICommandHandler<ReserveTicketCommand> {

   constructor(
      private readonly ticketRepo: TicketRepository,
      private readonly redis: RedisService
   ) { }

   async execute(command: ReserveTicketCommand) {

      // console.log(` ======================================= `);
      // console.log(` ==== INSIDE RESERVE TICKET HANDLER ==== `);
      // console.log(` ======================================= `);

      const { ticketTypeId, quantity, session } = command;

      const ticketType = await this.ticketRepo.ticketReserve(
         ticketTypeId,
         quantity,
         session
      );

      if (!ticketType) {
         throw new BadRequestException('Tickets not available');
      }

      await this.redis.decrby(
         `availability:ticket:${ticketTypeId}`,
         quantity
      );

      await this.redis.del(
         `tickets:event:${ticketType.eventId.toString()}`
      );

      return ticketType;
   }
}