import { Injectable } from "@nestjs/common";
import { BookingRepository } from "./repository/booking.repository";

@Injectable()
export class BookingService {
   constructor(private readonly bookingRepo: BookingRepository) { }

   async createBooking() {
      return await this.bookingRepo.createBooking();
   }
}