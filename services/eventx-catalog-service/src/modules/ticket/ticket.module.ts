import { Module } from "@nestjs/common";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { TicketRepository } from "./ticket.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketTypeSchema } from "./schema/ticket-type.schema";
import { OutboxModule } from "src/outbox/outbox.module";
import { TicketSagaProcessor } from "./saga/ticket-saga.processor";
import { TicketSagaService } from "./saga/ticket-saga.service";
import { BookingTicketHandler } from "./saga/handlers/booking.handler";
import { LoggingModule } from "../../logging/logging.module";
import { TicketHandler } from "./saga/handlers/ticket.handler";
import { BookingClientModule } from "src/clients/booking/booking.client.module";
import { ReserveTicketHandler } from "./cqrs/handlers/commands/reserve-ticket.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfirmTicketHandler } from "./cqrs/handlers/commands/confirm-ticket.handler";
import { ReleaseReservedTicketHandler } from "./cqrs/handlers/commands/release-ticket.handler";
import { MyRedisModule } from "src/redis/redis.module";
import { GetTicketsByEventHandler } from "./cqrs/handlers/queries/event-tickets.handler";
import { TicketByIDHandler } from "./cqrs/handlers/queries/ticket-by-id.handler";
import { CheckAvailabilityHandler } from "./cqrs/handlers/queries/check-availability.handler";


const CommandHandlers = [
   ReserveTicketHandler,
   ConfirmTicketHandler,
   ReleaseReservedTicketHandler
];

const QueryHandlers = [
   GetTicketsByEventHandler,
   TicketByIDHandler,
   CheckAvailabilityHandler
];


@Module({
   imports: [
      CqrsModule,
      MongooseModule.forFeature([{ name: 'TicketType', schema: TicketTypeSchema }]),
      LoggingModule,
      OutboxModule,
      BookingClientModule,
      MyRedisModule
   ],
   controllers: [TicketController],
   providers: [
      TicketService,
      TicketRepository,
      TicketSagaProcessor,
      TicketSagaService,
      BookingTicketHandler,
      TicketHandler,
      ...CommandHandlers,
      ...QueryHandlers
   ],
   exports: [TicketService]
})

export class TicketModule { }