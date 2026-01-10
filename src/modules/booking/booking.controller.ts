import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { GetUserID } from "src/common/decorators/used-id";


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
}