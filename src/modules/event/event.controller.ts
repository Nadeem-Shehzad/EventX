import {
   BadRequestException,
   Body, Controller, Delete, Get, HttpCode,
   HttpStatus, Logger, Param, Post, Query, UploadedFile,
   UseGuards, UseInterceptors
} from "@nestjs/common";
import { EventService } from "./event.service";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { CreateEventDTO } from "./dto/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";
import { EventOwnerShipGuard } from "src/common/guards/ownership.guard";
import { EventQueryDTO } from "./dto/event-query.dto";
import { EventStatusDTO } from "./dto/event-status.dto";
import { EventVisibilityDTO } from "./dto/event-visibility.dto";


@UseGuards(JwtAuthGuard, RoleCheckGuard)
@Controller('event')
export class EventController {

   constructor(private readonly eventService: EventService) { }
   private readonly logger = new Logger(EventService.name);

   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('')
   @Roles('organizer')
   @HttpCode(HttpStatus.CREATED)
   @UseInterceptors(
      FileInterceptor('bannerImage', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
      })
   )
   addEvent(
      @GetUserID() id: string,
      @Body() data: CreateEventDTO,
      @UploadedFile() file?: Express.Multer.File
   ) {
      if (!file) throw new BadRequestException('Image is required');

      const imageData = {
         url: file.path,
         publicId: file.filename // multer-storage-cloudinary puts the public_id here
      };

      data.bannerImage = imageData;
      return this.eventService.createEvent(id, data);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   getEvents() {
      return this.eventService.getAllEventsByAggregate();
   }


   // get events by category, tags, search and city
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/filter')
   @HttpCode(HttpStatus.OK)
   getEventsByFilter(@Query() query: EventQueryDTO) {
      return this.eventService.getEventsByFilter(query);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/free')
   @HttpCode(HttpStatus.OK)
   getFreeEvents() {
      return this.eventService.getFreeEvents();
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/paid')
   @HttpCode(HttpStatus.OK)
   getPaidEvents() {
      return this.eventService.getPaidEvents();
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/organizer/:id')
   @Roles('admin', 'organizer')
   @HttpCode(HttpStatus.OK)
   getOrganizerEvents(
      @Param('id') id: string,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.getOrganizerEvents(id, page, limit);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/organizer/:id')
   @Roles('organizer')
   @HttpCode(HttpStatus.OK)
   getOrganizerOwnEvents(
      @GetUserID() id: string,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.getOrganizerOwnEvents(id, page, limit);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('filter-by-status')
   @Roles('organizer', 'admin')
   @HttpCode(HttpStatus.OK)
   getEventsByStatus(
      @Query() query: EventStatusDTO,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.filterEventsByStatus(query.status, page, limit);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('filter-by-visibility')
   @Roles('organizer', 'admin')
   @HttpCode(HttpStatus.OK)
   filterEventsByVisibility(
      @Query() query: EventVisibilityDTO,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.filterEventsByVisibility(query.visibility, page, limit);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('upcoming-events')
   @HttpCode(HttpStatus.OK)
   upcomingEvents(
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.getUpcomingEvents(page, limit);
   }


   // get archived events ... organizer and admin only

   @UseGuards(EventOwnerShipGuard)
   @Post('/publish/:id')
   @Roles('organizer')
   @HttpCode(HttpStatus.OK)
   publishEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.publishEvent(eventId, organizerId);
   }


   @UseGuards(EventOwnerShipGuard)
   @Post('/cancel/:id')
   @Roles('organizer')
   @HttpCode(HttpStatus.OK)
   cancelEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.cancelEvent(eventId, organizerId);
   }


   @UseGuards(EventOwnerShipGuard)
   @Delete('/delete/:id')
   @Roles('organizer')
   @HttpCode(HttpStatus.OK)
   deleteEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.deleteEvent(eventId, organizerId);
   }


   @UseGuards(EventOwnerShipGuard)
   @Post('/recover/:id')
   @Roles('organizer')
   @HttpCode(HttpStatus.OK)
   recoverDeletedEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.recoverDeleteEvent(eventId, organizerId);
   }
}