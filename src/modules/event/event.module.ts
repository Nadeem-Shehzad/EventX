import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./event.schema";
import { EventRespository } from "./event.repository";
import { CommonModule } from "src/common/common.module";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
      CommonModule
   ],
   controllers: [EventController],
   providers: [EventService, EventRespository, JwtAuthGuard, RoleCheckGuard],
   exports: []
})

export class EventModule { }