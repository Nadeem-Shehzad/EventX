import {
   BadRequestException,
   Body, Controller, Delete, Get, HttpCode,
   HttpStatus, Logger, Param, Post, Put, Query, UploadedFile,
   UseGuards, UseInterceptors
} from "@nestjs/common";
import { EventService } from "./event.service";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { CreateEventDTO } from "./dto/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";
import { EventQueryDTO } from "./dto/event-query.dto";
import { EventStatusDTO } from "./dto/event-status.dto";
import { EventVisibilityDTO } from "./dto/event-visibility.dto";
import { PaginationDTO } from "./dto/pagination.dto";
import { UpdateEventDTO } from "./dto/update-event.dto";
import { EventOwnerShipGuard } from "./guards/ownership.guard";


@Controller({ path: 'events', version: '1' })
export class EventController {

   constructor(private readonly eventService: EventService) { }

   private readonly logger = new Logger(EventService.name);


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer')
   @Post('')
   @HttpCode(HttpStatus.CREATED)
   addEvent(
      @GetUserID() id: string,
      @Body() data: CreateEventDTO
   ) {
      return this.eventService.createEvent(id, data);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('/image-upload')
   @HttpCode(HttpStatus.CREATED)
   @UseInterceptors(
      FileInterceptor('image', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
      })
   )
   UploadImage(@UploadedFile() file?: Express.Multer.File) {
      if (!file) throw new BadRequestException('Image is required');

      const imageData = {
         url: file.path,
         publicId: file.filename // multer-storage-cloudinary puts the public_id here
      };

      return imageData;
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard, EventOwnerShipGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer')
   @Put('/:id')
   @HttpCode(HttpStatus.OK)
   updateEvent(
      @Param('id') eventId: string,
      @Body() dataToUpdate: UpdateEventDTO
   ) {
      return this.eventService.updateEvent(eventId, dataToUpdate);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   getEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getAllEventsByAggregate(page, limit);
   }


   // get events by category, tags, search and city
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/filter')
   //@SkipThrottle()
   @HttpCode(HttpStatus.OK)
   getEventsByFilter(@Query() query: EventQueryDTO) {
      return this.eventService.getEventsByFilter(query);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/free')
   //@SkipThrottle()
   @HttpCode(HttpStatus.OK)
   getFreeEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getFreeEvents(page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/paid')
   @HttpCode(HttpStatus.OK)
   getPaidEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getPaidEvents(page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('admin', 'organizer')
   @Get('/organizer/:id')
   @HttpCode(HttpStatus.OK)
   getOrganizerEvents(
      @Param('id') id: string,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.getOrganizerEvents(id, page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer')
   @Get('/organizer')
   @HttpCode(HttpStatus.OK)
   getOrganizerOwnEvents(
      @GetUserID() id: string,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.getOrganizerOwnEvents(id, page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('filter-by-status')
   @HttpCode(HttpStatus.OK)
   getEventsByStatus(
      @Query() query: EventStatusDTO,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.filterEventsByStatus(query.status, page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('filter-by-visibility')
   @HttpCode(HttpStatus.OK)
   filterEventsByVisibility(
      @Query() query: EventVisibilityDTO,
      @Query('page') page: number,
      @Query('limit') limit: number
   ) {
      return this.eventService.filterEventsByVisibility(query.visibility, page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('status-summary')
   @HttpCode(HttpStatus.OK)
   eventsStatusSummary() {
      return this.eventService.eventStatusSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('visibility-summary')
   @HttpCode(HttpStatus.OK)
   eventsVisibilitySummary() {
      return this.eventService.eventVisibilitySummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('event-type-summary')
   @HttpCode(HttpStatus.OK)
   eventsTypeSummary() {
      return this.eventService.eventTypeSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('tags-summary')
   @HttpCode(HttpStatus.OK)
   eventTagsSummary() {
      return this.eventService.eventTagsSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
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

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Post('/publish/:id')
   @HttpCode(HttpStatus.OK)
   publishEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.publishEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Post('/cancel/:id')
   @HttpCode(HttpStatus.OK)
   cancelEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.cancelEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Delete('/delete/:id')
   @HttpCode(HttpStatus.OK)
   softDeleteEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.softDeleteEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Post('/recover/:id')
   @HttpCode(HttpStatus.OK)
   recoverDeletedEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.recoverDeleteEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard, EventOwnerShipGuard)
   @Roles('organizer')
   @Delete('/delete-permanent/:id')
   @HttpCode(HttpStatus.OK)
   deleteEventPermanently(@Param('id') id: string, @GetUserID() organizerId: string) {
      return this.eventService.deleteEventPermanently(id, organizerId);
   }
}