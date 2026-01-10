import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { BookingDocument } from "../schema/booking.schema";

@Injectable()
export class BookingRepository {
   constructor(@InjectModel('Booking') private bookingModel: Model<BookingDocument>) { }

   async createBooking(data: Partial<BookingDocument>, session: ClientSession) {
      const [booking] = await this.bookingModel.create([data], { session });
      return booking;
   }
}