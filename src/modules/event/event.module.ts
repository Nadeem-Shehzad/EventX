import { forwardRef, Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./schema/event.schema";
import { EventRespository } from "./event.repository";
import { CommonModule } from "src/common/common.module";
import { MyRedisModule } from "src/redis/redis.module";
import { ImageQueueModule } from "src/queue/event-image/image.queue.module";
import { EventOwnerShipGuard } from "./guards/ownership.guard";
import { TicketTypeSchema } from "../ticket/schema/ticket-type.schema";
import { TicketModule } from "../ticket/ticket.module";

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: 'Event', schema: EventSchema },
         { name: 'TicketType', schema: TicketTypeSchema }
      ]),
      forwardRef(() => CommonModule),
      ImageQueueModule,
      MyRedisModule,
      TicketModule
   ],
   controllers: [EventController],
   providers: [EventService, EventRespository, EventOwnerShipGuard],
   exports: [EventService, EventRespository, MongooseModule]
})

export class EventModule { }