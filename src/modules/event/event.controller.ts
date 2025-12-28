import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { CreateEventDTO } from "./dto/create-event.dto";


@UseGuards(JwtAuthGuard, RoleCheckGuard)
@Controller('event')
export class EventController {

   constructor(private readonly eventService: EventService) { }

   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('')
   @Roles('organizer')
   @HttpCode(HttpStatus.CREATED)
   addEvent(@Body() data: CreateEventDTO, @GetUserID() id: string) {
      return this.eventService.createEvent(data, id);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   getEvents() {
      return this.eventService.getAllEvents();
   }
}