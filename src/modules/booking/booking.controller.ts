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


@Controller({ path: 'bookings', version: '1' })
export class BookingController {
   constructor(private readonly service: BookingService) { }

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Roles('user')
   @Post('create')
   @HttpCode(HttpStatus.CREATED)
   createBooking(@GetUserID() userId: string, @Body() dto: CreateBookingDTO) {
      return this.service.createBooking(userId, dto);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
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
   getBookingsByFilter(@Query() query: BookingQueryDTO) {
      return this.service.bookingByFilter(query);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get(':id')
   @HttpCode(HttpStatus.OK)
   getOneBooking(@Param('id') id: string) {
      return this.service.getOneBooking(id);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('event/:id')
   @HttpCode(HttpStatus.OK)
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
   confirmBooking(@Param('id') bookingId: string) {
      return this.service.confirmBooking(bookingId);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('cancel/:id')
   @HttpCode(HttpStatus.OK)
   cancelBooking(@Param('id') bookingId: string) {
      return this.service.cancelBooking(bookingId);
   }


   // get bookings summary
   // get highgrossing bookings
}