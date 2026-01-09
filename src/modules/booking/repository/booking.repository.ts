import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDocument } from "../schema/booking.schema";

@Injectable()
export class BookingRepository {
   constructor(@InjectModel('Booking') bookingModel: Model<BookingDocument>) { }

   async createBooking() {
      return 'Welcome in Booking Creation ...';
   }
}