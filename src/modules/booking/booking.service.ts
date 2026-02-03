import {
   BadRequestException, forwardRef, Inject,
   Injectable, NotFoundException
} from "@nestjs/common";
import { BookingRepository } from "./repository/booking.repository";
import { Connection, Model, Types } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { TicketTypeDocument } from "../ticket/schema/ticket-type.schema";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { BookingStatus } from "./enum/booking-status.enum";
import { PaymentService } from "src/payment/payment.service";
import { BookingQueryDTO } from "./dto/booking-query.dto";
import { plainToInstance } from "class-transformer";
import { BookingResponseDTO } from "./dto/booking.response.dto";
import { RedisService } from "src/redis/redis.service";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatus } from "../../constants/payment-status.enum";
import { BookingJob, EmailJob } from "src/constants/email-queue.constants";
import { OutboxService } from "src/outbox/outbox.service";
import {
   BookingConfirmedFailedPayload,
   BookingConfirmedPayload,
   BookingCreatedPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AGGREGATES } from "src/constants/events/domain-aggregate";


@Injectable()
export class BookingService {

   constructor(
      @InjectConnection() private readonly connection: Connection,
      @InjectModel('TicketType') private ticketModel: Model<TicketTypeDocument>,
      private readonly bookingRepo: BookingRepository,
      @Inject(forwardRef(() => PaymentService))
      private readonly paymentService: PaymentService,
      private readonly redis: RedisService,
      private readonly eventEmitter: EventEmitter2,
      private readonly outboxService: OutboxService
   ) { }


   async createBooking(userId: string, dto: CreateBookingDTO) {

      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         let status = BookingStatus.PENDING;

         // if (!ticketType.isPaidEvent) {
         //    status = BookingStatus.CONFIRMED;

         //    await this.ticketModel.updateOne(
         //       { _id: ticketType._id },
         //       {
         //          $inc: {
         //             soldQuantity: dto.quantity,
         //             reservedQuantity: -dto.quantity,
         //          },
         //       },
         //       { session },
         //    );
         // }

         const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

         const booking = await this.bookingRepo.createBooking(
            {
               userId: new Types.ObjectId(userId),
               eventId: new Types.ObjectId(dto.eventId),
               ticketTypeId: new Types.ObjectId(dto.ticketTypeId),
               quantity: dto.quantity,
               amount: 0,
               currency: 'PKR',
               status,
               expiresAt,
            },
            session,
         );

         const payload: BookingCreatedPayload = {
            bookingId: booking.id,
            userId,
            eventId: booking.eventId.toString(),
            ticketTypeId: dto.ticketTypeId,
            quantity: booking.quantity
         }

         await this.outboxService.addEvent<BookingCreatedPayload>(
            'Booking',
            booking.id,
            DOMAIN_EVENTS.BOOKING_CREATED,
            payload,
            session
         );

         await session.commitTransaction();

         this.eventEmitter.emit(BookingJob.BOOKING_CREATED, {
            bookingId: booking._id.toString(),
            eventId: booking.eventId.toString(),
            userId
         });

         return { bookingId: booking._id.toString(), status: 'PENDING' };

      } catch (error) {

         await session.abortTransaction();

         this.eventEmitter.emit(EmailJob.BOOKING_FAILED, {
            userId,
            reason: error.message
         });

         throw error;

      } finally {
         session.endSession();
      }
   }


   async getAllBookings(page = 1, limit = 10) {

      const cacheKey = `all-bookings:${page}-${limit}`;

      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
         return JSON.parse(cachedData);
      }

      const { bookings, meta } = await this.bookingRepo.allBookings(page, limit);

      const result = plainToInstance(BookingResponseDTO, bookings, {
         excludeExtraneousValues: true
      });

      const finalResult = { bookings: result, meta };

      await this.redis.set(
         cacheKey,
         JSON.stringify(finalResult),
         60
      );

      return finalResult;
   }


   async bookingByFilter(query: BookingQueryDTO) {
      const { userId, eventId, status, dateFrom, dateTo, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const filter: any = {};

      if (userId) filter.userId = userId;
      if (eventId) filter.eventId = new Types.ObjectId(eventId);
      if (status) filter.status = status;
      if (dateFrom) filter.dateFrom = dateFrom;
      if (dateTo) filter.dateTo = dateTo;

      //console.log('filter -> ', filter);

      return await this.bookingRepo.getBookingsByFilter(filter, { limit, skip });
   }


   async getOneBooking(id: string) {
      const booking = await this.bookingRepo.findBookingById(id);

      const finalResult = plainToInstance(BookingResponseDTO, booking, {
         excludeExtraneousValues: true
      });

      return finalResult;
   }


   async getEventBookings(eventId: string, page: number, limit: number) {

      const chacheKey = `event-bookings:${eventId}-${page}-${limit}`;

      const chacheData = await this.redis.get(chacheKey);
      if (chacheData) {
         return JSON.parse(chacheData);
      }

      const { bookings, meta } = await this.bookingRepo.findBookingsByEventId(eventId, page, limit);

      const result = plainToInstance(BookingResponseDTO, bookings, {
         excludeExtraneousValues: true
      });

      const finalResult = { bookings: result, meta };

      await this.redis.set(
         chacheKey,
         JSON.stringify(finalResult),
         60
      )

      return finalResult;
   }


   async getUserBookings(userId: string, page: number, limit: number) {

      const { bookings, meta } = await this.bookingRepo.findBookingsByUserId(userId, page, limit);

      const result = plainToInstance(BookingResponseDTO, bookings, {
         excludeExtraneousValues: true
      });

      const finalResult = { bookings: result, meta };

      return finalResult;
   }


   async confirmBookingRequest(bookingId: string, paymentIntentId?: string) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         const booking = await this.bookingRepo.findBookingById(bookingId);
         if (!booking) throw new NotFoundException('Booking Not Found!');

         if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Booking already processed');
         }

         const patch: any = {
            status: BookingStatus.CONFIRMED,
            paymentStatus: paymentIntentId
               ? PaymentStatus.SUCCEEDED
               : PaymentStatus.NOT_REQUIRED
         }

         if (paymentIntentId) {
            patch.paymentIntentId = paymentIntentId;
         }

         const updatedBooking = await this.bookingRepo.updateStatus(
            bookingId,
            patch,
            session
         );

         await this.ticketModel.updateOne(
            { _id: booking.ticketTypeId },
            {
               $inc: {
                  soldQuantity: booking.quantity,
                  reservedQuantity: booking.quantity
               }
            },
            { session }
         );

         await session.commitTransaction();

         return updatedBooking;

      } catch (error) {
         await session.abortTransaction();

      } finally {
         session.endSession();
      }
   }


   async bookingConfirmed(bookingId: string, eventId: string, userId: string) {

      try {
         this.eventEmitter.emit('booking.updated', {
            bookingId: bookingId,
            eventId: eventId,
            userId: userId
         });

         this.eventEmitter.emit(EmailJob.BOOKING_SUCCESS, {
            bookingId: bookingId,
            eventId: eventId,
            userId: userId
         });

         return true;

      } catch (error) {
         console.log('----- Error in booking-Confirmed Service -----');
      }
   }


   async cancelBookingRequest(bookingId: string) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         const booking = await this.bookingRepo.findBookingById(bookingId);
         if (!booking) throw new NotFoundException('Booking Not Found!');

         if (booking.status === BookingStatus.CANCELLED) return;

         // free event
         if (!booking.paymentIntentId) {
            const patch: any = {
               status: BookingStatus.CANCELLED,
            }

            const updatedBooking = await this.bookingRepo.updateStatus(
               bookingId,
               patch,
               session
            );

            await this.ticketModel.updateOne(
               { _id: booking.ticketTypeId },
               {
                  $inc: {
                     availableQuantity: booking.quantity,
                     reservedQuantity: -booking.quantity
                  }
               },
               { session }
            );

            await session.commitTransaction();

            this.eventEmitter.emit('booking.updated', {
               bookingId: booking._id.toString(),
               eventId: booking.eventId.toString(),
               userId: booking.userId.toString()
            });

            return updatedBooking;
         }


         await session.commitTransaction();

         const payload: BookingConfirmedFailedPayload = {
            bookingId: bookingId,
            paymentIntent: booking.paymentIntentId
         }

         await this.emit(DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST, bookingId, payload);
         return booking;

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   async cancelConfirmedBooking() { }


   async markBookingRefunded(paymentIntentId: string) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         const booking = await this.bookingRepo.findBookingByPaymentIntentId(paymentIntentId, session);

         if (!booking) return true;
         if (booking.paymentStatus === PaymentStatus.REFUNDED) return true;
         if (booking.status !== BookingStatus.CONFIRMED) return true;

         const patch: any = {
            status: BookingStatus.CANCELLED,
            paymentStatus: PaymentStatus.REFUNDED
         }

         const updatedBooking = await this.bookingRepo.updateStatus(
            booking._id.toString(),
            patch,
            session
         );

         await this.ticketModel.updateOne(
            { _id: booking.ticketTypeId },
            {
               $inc: {
                  availableQuantity: booking.quantity,
                  reservedQuantity: -booking.quantity
               }
            },
            { session }
         );

         await session.commitTransaction();

         this.eventEmitter.emit('booking.updated', {
            bookingId: booking._id.toString(),
            eventId: booking.eventId.toString(),
            userId: booking.userId.toString()
         });

         this.eventEmitter.emit(EmailJob.BOOKING_CANCEL, {
            bookingId: booking._id.toString(),
            eventId: booking.eventId.toString(),
            userId: booking.userId.toString()
         });

         return true;

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   async bookingFailed(bookingId: string) {
      const booking = await this.bookingRepo.findBookingById(bookingId);
      if (!booking) throw new NotFoundException('Booking Not Found!');

      const patch: any = {
         status: BookingStatus.FAILED,
         paymentStatus: PaymentStatus.NOT_REQUIRED
      }

      await this.bookingRepo.updateStatus(
         bookingId,
         patch
      );
   }


   // public 
   async getBookingById(id: string) {
      return await this.bookingRepo.findBookingById(id);
   }


   async findBookingsByEventIdAndPaymentStatus(eventId: string) {
      return await this.bookingRepo.findBookingsByEventIdAndPaymentStatus(eventId);
   }


   // private 
   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}