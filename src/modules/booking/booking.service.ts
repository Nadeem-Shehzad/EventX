import { BadRequestException, Injectable } from "@nestjs/common";
import { BookingRepository } from "./repository/booking.repository";
import { Connection, Model, Types } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { TicketTypeDocument } from "../event/schema/ticket-type.schema";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { BookingStatus } from "./enum/booking-status.enum";

@Injectable()
export class BookingService {

   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly bookingRepo: BookingRepository,
      @InjectModel('TicketType') private ticketModel: Model<TicketTypeDocument>
   ) { }


   async createBooking(userId: string, dto: CreateBookingDTO) {

      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         const ticketType = await this.ticketModel.findOneAndUpdate(
            {
               _id: dto.ticketTypeId,
               //eventId: dto.eventId,
               availableQuantity: { $gte: dto.quantity }
            },
            {
               $inc: {
                  reservedQuantity: dto.quantity,
                  availableQuantity: -dto.quantity
               }
            },
            {
               new: true,
               session
            }
         );

         if (!ticketType) {
            throw new BadRequestException('Tickets not available');
         }

         let status = BookingStatus.PENDING;

         if (!ticketType.isPaidEvent) {
            status = BookingStatus.CONFIRMED;

            await this.ticketModel.updateOne(
               { _id: ticketType._id },
               {
                  $inc: {
                     soldQuantity: dto.quantity,
                     reservedQuantity: -dto.quantity,
                  },
               },
               { session },
            );
         }

         const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

         const booking = await this.bookingRepo.createBooking(
            {
               userId: new Types.ObjectId(userId),
               eventId: new Types.ObjectId(dto.eventId),
               ticketTypeId: new Types.ObjectId(dto.ticketTypeId),
               quantity: dto.quantity,
               amount: ticketType.isPaidEvent ? ticketType.price * dto.quantity : 0,
               currency: 'PKR',
               status,
               expiresAt: ticketType.isPaidEvent ? expiresAt : undefined,
            },
            session,
         );

         const bookingObj = booking.toObject();

         await session.commitTransaction();

         return {
            bookingId: bookingObj._id.toString(),
            userId: bookingObj.userId.toString(),
            eventId: bookingObj.eventId.toString(),
            ticketTypeId: bookingObj.ticketTypeId.toString(),
            quantity: bookingObj.quantity,
            status: bookingObj.status,
            amount: bookingObj.amount,
            currency: bookingObj.currency,
            confirmedAt: bookingObj.confirmedAt,
         };

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   // async createBooking(userId: string, dto: CreateBookingDTO) {

   //    const session = await this.connection.startSession();
   //    session.startTransaction();

   //    try {

   //       const ticketType = await this.ticketModel.findOneAndUpdate(
   //          {
   //             _id: dto.ticketTypeId,
   //             isPaidEvent: false,
   //             availableQuantity: { $gte: dto.quantity }
   //          },
   //          {
   //             $inc: {
   //                soldQuantity: dto.quantity,
   //                availableQuantity: -dto.quantity
   //             }
   //          },
   //          {
   //             new: true,
   //             session
   //          }
   //       );

   //       if (!ticketType) {
   //          throw new BadRequestException('Tickets not available');
   //       }

   //       const booking = await this.bookingRepo.createBooking(
   //          {
   //             userId: new Types.ObjectId(userId),
   //             eventId: new Types.ObjectId(dto.eventId),
   //             ticketTypeId: new Types.ObjectId(dto.ticketTypeId),
   //             quantity: dto.quantity,
   //             amount: 0,
   //             currency: 'PKR',
   //             status: BookingStatus.CONFIRMED,
   //             confirmedAt: new Date(),
   //          },
   //          session,
   //       );

   //       const bookingObj = booking.toObject();

   //       await session.commitTransaction();

   //       return {
   //          bookingId: bookingObj._id.toString(),
   //          userId: bookingObj.userId.toString(),
   //          eventId: bookingObj.eventId.toString(),
   //          ticketTypeId: bookingObj.ticketTypeId.toString(),
   //          quantity: bookingObj.quantity,
   //          status: bookingObj.status,
   //          amount: bookingObj.amount,
   //          currency: bookingObj.currency,
   //          confirmedAt: bookingObj.confirmedAt,
   //       };

   //    } catch (error) {
   //       await session.abortTransaction();
   //       throw error;

   //    } finally {
   //       session.endSession();
   //    }
   // }
}