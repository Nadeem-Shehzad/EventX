import { Module } from "@nestjs/common";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { TicketRepository } from "./ticket.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketTypeSchema } from "./schema/ticket-type.schema";



@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'TicketType', schema: TicketTypeSchema }])
   ],
   controllers: [TicketController],
   providers: [TicketService, TicketRepository],
   exports: [TicketService]
})

export class TicketModule { }