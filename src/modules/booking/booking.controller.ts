import {
   Body, Controller, DefaultValuePipe, Get,
   HttpCode, HttpStatus, Param, ParseIntPipe,
   Post, Query, UseGuards
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { GetUserID } from "src/common/decorators/used-id";
import { BookingQueryDTO } from "./dto/booking-query.dto";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateBookingResponseDTO } from "./swagger/response/create-booking-response.dto";
import { BookingResponseDTO } from "./dto/booking.response.dto";
import { PaginatedBookingsResponseDTO } from "./swagger/response/all-bookings-response.dto";
import { BookingStatusResponseDTO } from "./swagger/response/booking-status-response.dto";


@ApiTags('bookings')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'bookings', version: '1' })
export class BookingController {
   constructor(private readonly service: BookingService) { }

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('user')
   @Post('create')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Create booking' })
   @ApiBody({
      type: CreateBookingDTO
   })
   @ApiResponse({
      status: 201,
      type: CreateBookingResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'Event not Found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   createBooking(@GetUserID() userId: string, @Body() dto: CreateBookingDTO) {
      return this.service.createBooking(userId, dto);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all booking' })
   @ApiQuery({
      name: 'page', required: true,
      schema: {
         type: 'number',
         example: 1
      }
   })
   @ApiQuery({
      name: 'limit', required: true,
      schema: {
         type: 'number',
         example: 10
      }
   })
   @ApiResponse({
      status: 201,
      type: PaginatedBookingsResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getAllBookings(
      @Query('page', ParseIntPipe) page: number = 1,
      @Query('limit', ParseIntPipe) limit: number = 10
   ) {
      return this.service.getAllBookings(page, limit);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   //@Roles('user')
   @Get('filter')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get bookings by filter' })
   @ApiResponse({
      status: 201,
      type: PaginatedBookingsResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getBookingsByFilter(@Query() query: BookingQueryDTO) {
      return this.service.bookingByFilter(query);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get(':id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get bookings by id' })
   @ApiQuery({
      name: 'id',
      required: true,
      schema: {
         type: 'string',
         example: 'skjhfsjdhsjkdfh87s'
      }
   })
   @ApiResponse({
      status: 201,
      type: BookingResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'not found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getOneBooking(@Param('id') id: string) {
      return this.service.getOneBooking(id);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('event/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get event bookings' })
   @ApiQuery({
      name: 'id',
      required: true,
      schema: {
         type: 'string',
         example: 'skjhfsjdhsjkdfh87s'
      }
   })
   @ApiQuery({
      name: 'page',
      required: true,
      schema: {
         type: 'number',
         example: 1
      }
   })
   @ApiQuery({
      name: 'limit',
      required: true,
      schema: {
         type: 'number',
         example: 10
      }
   })
   @ApiResponse({
      status: 201,
      type: PaginatedBookingsResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'not found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getEventBookings(
      @Param('id') eventId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
   ) {
      return this.service.getEventBookings(eventId, page, limit);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('user/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get user bookings' })
   @ApiQuery({
      name: 'id',
      required: true,
      schema: {
         type: 'string',
         example: 'skjhfsjdhsjkdfh87s'
      }
   })
   @ApiQuery({
      name: 'page',
      required: true,
      schema: {
         type: 'number',
         example: 1
      }
   })
   @ApiQuery({
      name: 'limit',
      required: true,
      schema: {
         type: 'number',
         example: 10
      }
   })
   @ApiResponse({
      status: 201,
      type: PaginatedBookingsResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'not found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   getUserBookings(
      @Param('id') userId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
   ) {
      return this.service.getUserBookings(userId, page, limit);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('confirm/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Confirm booking' })
   @ApiQuery({
      name: 'id',
      required: true,
      schema: {
         type: 'string',
         example: 'skjhfsjdhsjkdfh87s'
      }
   })
   @ApiResponse({
      status: 201,
      type: BookingStatusResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'not found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   confirmBooking(@Param('id') bookingId: string) {
      return this.service.confirmBooking(bookingId);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('cancel/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Cancel booking' })
   @ApiQuery({
      name: 'id',
      required: true,
      schema: {
         type: 'string',
         example: 'skjhfsjdhsjkdfh87s'
      }
   })
   @ApiResponse({
      status: 201,
      type: BookingStatusResponseDTO
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'not found' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   cancelBooking(@Param('id') bookingId: string) {
      return this.service.cancelBooking(bookingId);
   }


   // get bookings summary
   // get highgrossing bookings
}