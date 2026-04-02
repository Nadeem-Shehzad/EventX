import { forwardRef, Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./schema/event.schema";
import { EventRepository } from "./event.repository";
import { CommonModule } from "src/common/common.module";
import { MyRedisModule } from "src/redis/redis.module";
import { ImageQueueModule } from "src/queue/event-image/image.queue.module";
import { EventOwnerShipGuard } from "./guards/ownership.guard";
import { TicketModule } from "../ticket/ticket.module";
import { EventOutboxModule } from "./outbox/event-outbox.module";
import { TicketConsumer } from "./listeners/event-creation.listener";


@Module({
   imports: [

      MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),

      TicketModule,
      EventOutboxModule,
      ImageQueueModule,
      MyRedisModule
   ],
   controllers: [EventController],
   providers: [
      EventService,
      EventRepository,
      EventOwnerShipGuard,
      TicketConsumer
   ],
   exports: [EventService, EventRepository, MongooseModule]
})

export class EventModule { }