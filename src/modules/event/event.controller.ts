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
import { CreateEventDTO } from "./dto/request/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";
import { EventQueryDTO } from "./dto/request/event-query.dto";
import { EventStatusDTO } from "./dto/request/event-status.dto";
import { EventVisibilityDTO } from "./dto/request/event-visibility.dto";
import { PaginationDTO } from "./dto/request/pagination.dto";
import { UpdateEventDTO } from "./dto/request/update-event.dto";
import { EventOwnerShipGuard } from "./guards/ownership.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateEventResponseDTO } from "./dto/response/create-event-response.dto";
import { PaginatedEventsResponseDTO } from "./dto/response/paginated-events-response.dto";
import { EventResponseDTO } from "./dto/response/event-response.dto";
import { EventsStatusSummaryResponseDTO } from "./swagger/response/status-summary-response.dto";
import { EventsVisibilitySummaryResponseDTO } from "./swagger/response/visibility-summary-response.dto";
import { EventsTypesSummaryResponseDTO } from "./swagger/response/event-type-summary-response.dto";
import { EventsTagsSummaryResponseDTO } from "./swagger/response/tags-summary-response.dto";


@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'events', version: '1' })
export class EventController {

   constructor(private readonly eventService: EventService) { }

   private readonly logger = new Logger(EventService.name);


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer')
   @Post('')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Add a new event' })
   @ApiResponse({
      status: 201,
      description: 'Event created successfully',
      type: CreateEventResponseDTO,
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   addEvent(
      @GetUserID() id: string,
      @Body() data: CreateEventDTO) {
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
   @ApiOperation({ summary: 'Update an event' })
   @ApiResponse({
      status: 201,
      description: 'Event updated successfully',
      type: UpdateEventDTO,
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   updateEvent(
      @Param('id') eventId: string,
      @Body() dataToUpdate: UpdateEventDTO
   ) {
      return this.eventService.updateEvent(eventId, dataToUpdate);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all events (paginated)' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   @ApiQuery({ name: 'page', example: 1, required: false })
   @ApiQuery({ name: 'limit', example: 10, required: false })
   getEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getAllEventsByAggregate(page, limit);
   }


   // get events by category, tags, search and city
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/filter')
   //@SkipThrottle()
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all events (paginated) based on filters' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   getEventsByFilter(@Query() query: EventQueryDTO) {
      return this.eventService.getEventsByFilter(query);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/free')
   //@SkipThrottle()
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all free events (paginated)' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of free events',
      type: PaginatedEventsResponseDTO
   })
   getFreeEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getFreeEvents(page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('/paid')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all paid events (paginated)' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of paid events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getPaidEvents(@Query() pagination: PaginationDTO) {
      const { page, limit } = pagination;
      return this.eventService.getPaidEvents(page, limit);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('admin', 'organizer')
   @Get('/organizer/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all events (paginated) based on organizerId' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of organizer events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
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
   @ApiOperation({ summary: 'Get all events (paginated) of an organizer' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
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
   @ApiOperation({ summary: 'Get all events (paginated) based on status' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
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
   @ApiOperation({ summary: 'Get all events (paginated) based on visibility' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
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
   @ApiOperation({ summary: 'Get summary of events based on status' })
   @ApiResponse({
      status: 200,
      description: 'Status summary of events',
      type: EventsStatusSummaryResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   eventsStatusSummary() {
      return this.eventService.eventStatusSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('visibility-summary')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get summary of events based on visibility' })
   @ApiResponse({
      status: 200,
      description: 'Visibility summary of events',
      type: EventsVisibilitySummaryResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   eventsVisibilitySummary() {
      return this.eventService.eventVisibilitySummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('event-type-summary')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get summary of events based on types' })
   @ApiResponse({
      status: 200,
      description: 'Types summary of events',
      type: EventsTypesSummaryResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   eventsTypeSummary() {
      return this.eventService.eventTypeSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('organizer', 'admin')
   @Get('tags-summary')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get summary of events based on tags' })
   @ApiResponse({
      status: 200,
      description: 'Tags summary of events',
      type: EventsTagsSummaryResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   eventTagsSummary() {
      return this.eventService.eventTagsSummary();
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('upcoming-events')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all upcoming events (paginated)' })
   @ApiResponse({
      status: 200,
      description: 'Paginated list of events',
      type: PaginatedEventsResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
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
   @ApiOperation({ summary: 'Publish an event' })
   @ApiParam({
      name: 'id',
      type: String,
      description: 'Event ID to be published',
      example: '65b12c8a9f4c2e001f3a9d21'
   })
   @ApiResponse({
      status: 200,
      description: 'Event Published',
      type: EventResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   publishEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.publishEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Post('/cancel/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Cancel an event' })
   @ApiParam({
      name: 'id',
      type: String,
      description: 'Event ID to be cancelled',
      example: '65b12c8a9f4c2e001f3a9d21'
   })
   @ApiResponse({
      status: 200,
      description: 'Event Cancelled',
      type: EventResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   cancelEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.cancelEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Delete('/delete/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Soft delete an event' })
   @ApiParam({
      name: 'id',
      type: String,
      description: 'Event ID to be soft delete',
      example: '65b12c8a9f4c2e001f3a9d21'
   })
   @ApiResponse({
      status: 200,
      description: 'Event Deleted Successfully'
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   softDeleteEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.softDeleteEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseGuards(EventOwnerShipGuard)
   @Roles('organizer')
   @Post('/recover/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Recover an event' })
   @ApiParam({
      name: 'id',
      type: String,
      description: 'Event ID to be recovered',
      example: '65b12c8a9f4c2e001f3a9d21'
   })
   @ApiResponse({
      status: 200,
      description: 'Event Recovered',
      type: EventResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   recoverDeletedEvent(@Param('id') eventId: string, @GetUserID() organizerId: string) {
      return this.eventService.recoverDeletedEvent(eventId, organizerId);
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard, EventOwnerShipGuard)
   @Roles('organizer')
   @Delete('/delete-permanent/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Delete an event Permanently' })
   @ApiParam({
      name: 'id',
      type: String,
      description: 'Event ID to be permanently deleted',
      example: '65b12c8a9f4c2e001f3a9d21'
   })
   @ApiResponse({
      status: 200,
      description: 'Event Deleted Permanently'
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   deleteEventPermanently(@Param('id') id: string, @GetUserID() organizerId: string) {
      return this.eventService.deleteEventPermanently(id, organizerId);
   }
}