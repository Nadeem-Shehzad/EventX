import { forwardRef, Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./event.schema";
import { EventRespository } from "./event.repository";
import { CommonModule } from "src/common/common.module";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { MyRedisModule } from "src/redis/redis.module";
import { RedisService } from "src/redis/redis.service";
import { ImageQueueModule } from "src/queue/event-image/image.queue.module";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
      forwardRef(() => CommonModule),
      ImageQueueModule,
      MyRedisModule
   ],
   controllers: [EventController],
   providers: [EventService, EventRespository, JwtAuthGuard, RoleCheckGuard, RedisService],
   exports: [EventService, EventRespository, MongooseModule]
})

export class EventModule { }