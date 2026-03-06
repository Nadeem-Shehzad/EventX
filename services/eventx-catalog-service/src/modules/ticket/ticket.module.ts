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


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'TicketType', schema: TicketTypeSchema }]),
      LoggingModule,
      OutboxModule, 
      BookingClientModule
   ],
   controllers: [TicketController],
   providers: [
      TicketService,
      TicketRepository,
      TicketSagaProcessor,
      TicketSagaService,
      BookingTicketHandler,
      TicketHandler
   ],
   exports: [TicketService]
})

export class TicketModule { }