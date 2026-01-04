import { forwardRef, Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./event.schema";
import { EventRespository } from "./event.repository";
import { CommonModule } from "src/common/common.module";
import { MyRedisModule } from "src/redis/redis.module";
import { ImageQueueModule } from "src/queue/event-image/image.queue.module";
import { EventOwnerShipGuard } from "./guards/ownership.guard";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
      forwardRef(() => CommonModule),
      ImageQueueModule,
      MyRedisModule
   ],
   controllers: [EventController],
   providers: [EventService, EventRespository, EventOwnerShipGuard],
   exports: [EventService, EventRespository, MongooseModule]
})

export class EventModule { }