import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { GetUserID } from "src/common/decorators/used-id";
import { BookingQueryDTO } from "./dto/booking-query.dto";


@Controller({ path: 'bookings', version: '1' })
export class BookingController {
   constructor(private readonly service: BookingService) { }

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Roles('user')
   @Post('create')
   @HttpCode(HttpStatus.CREATED)
   createBooking(@GetUserID() userId: string, @Body() dto: CreateBookingDTO) {
      return this.service.createBooking(userId, dto);
   }


   @UseGuards(JwtAuthGuard)
   @Get('')
   @HttpCode(HttpStatus.OK)
   getAllBookings() {
      return this.service.getAllBookings();
   }


   @UseGuards(JwtAuthGuard)
   //@Roles('user')
   @Get('/filter')
   @HttpCode(HttpStatus.OK)
   getBookingsByFilter(@Query() query: BookingQueryDTO) {
      return this.service.bookingByFilter(query);
   }


   @UseGuards(JwtAuthGuard)
   @Get('/:id')
   @HttpCode(HttpStatus.OK)
   getOneBooking(@Param('id') id: string) {
      return this.service.getOneBooking(id);
   }


   @UseGuards(JwtAuthGuard)
   @Get('/event/:id')
   @HttpCode(HttpStatus.OK)
   getEventBookings(@Param('id') eventId: string) {
      return this.service.getEventBookings(eventId);
   }


   @UseGuards(JwtAuthGuard)
   @Get('/user/:id')
   @HttpCode(HttpStatus.OK)
   getUserBookings(@Param('id') userId: string) {
      return this.service.getUserBookings(userId);
   }


   // search booking
   // get bookings by status
   // get bookings summary
   // get cancelled bookings
   // get highgrossing bookings
}