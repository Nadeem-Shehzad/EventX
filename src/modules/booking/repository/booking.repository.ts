import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, PipelineStage, Types } from "mongoose";
import { BookingDocument } from "../schema/booking.schema";
import { BookingStatus } from "../enum/booking-status.enum";

@Injectable()
export class BookingRepository {
   constructor(@InjectModel('Booking') private bookingModel: Model<BookingDocument>) { }

   async createBooking(data: Partial<BookingDocument>, session: ClientSession) {
      const [booking] = await this.bookingModel.create([data], { session });
      return booking;
   }


   async allBookings() {
      const booking = await this.bookingModel.find({});
      return booking;
   }


   async getBookingsByFilter(filter: any, options: { limit: number; skip: number }) {
      const pipeline: PipelineStage[] = [
         { $match: filter },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               data: [
                  { $skip: options.skip },
                  { $limit: options.limit },
                  {
                     $project: publicResponseData
                  }
               ],
               totalCount: [
                  { $count: 'count' }
               ]
            }
         }
      ];

      const result = await this.bookingModel.aggregate(pipeline);

      const bookings = result[0].data.map(b => ({
         ...b,
         userId: b.userId.toString(),
         eventId: b.eventId.toString(),
         ticketTypeId: b.ticketTypeId.toString(),
         _id: b._id.toString()
      }));

      const total = result[0].totalCount[0]?.count || 0;

      return {
         bookings,
         meta: {
            total,
            page: Math.floor(options.skip / options.limit) + 1,
            limit: options.limit,
            totalPages: Math.ceil(total / options.limit)
         }
      };
   }


   async findBookingById(bookingId: string) {
      const booking = await this.bookingModel.findById(bookingId);
      return booking;
   }


   async findBookingsByEventId(eventId: string) {
      const objId = new Types.ObjectId(eventId);
      const booking = await this.bookingModel.find({ eventId: objId });
      return booking;
   }


   async findBookingsByUserId(userId: string) {
      const objId = new Types.ObjectId(userId);
      const booking = await this.bookingModel.find({ userId: objId });
      return booking;
   }


   async updateStatus(bookingId: string, status: BookingStatus, session: ClientSession) {
      const booking = await this.bookingModel.findOneAndUpdate(
         { _id: bookingId },
         {
            $set: {
               status,
               updatedAt: new Date()
            }
         },
         { new: true, session }
      );
      return booking;
   }
}


export const publicResponseData = {
   _id: { $toString: '$_id' },
   userId: 1,
   eventId: 1,
   ticketTypeId: 1,
   quantity: 1,
   status: 1,
   amount: 1,
   currency: 1
}