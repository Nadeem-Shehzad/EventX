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


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'TicketType', schema: TicketTypeSchema }]),
      OutboxModule
   ],
   controllers: [TicketController],
   providers: [
      TicketService, 
      TicketRepository, 
      TicketSagaProcessor,
      TicketSagaService,
      BookingTicketHandler
   ],
   exports: [TicketService]
})

export class TicketModule { }