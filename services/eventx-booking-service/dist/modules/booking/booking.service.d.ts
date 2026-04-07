import { BookingRepository } from "./repository/booking.repository";
import { Connection, Types } from "mongoose";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { BookingQueryDTO } from "./dto/booking-query.dto";
import { BookingResponseDTO } from "./dto/booking.response.dto";
import { RedisService } from "src/redis/redis.service";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutboxService } from "src/outbox/outbox.service";
import { MetricsService } from "src/monitoring/metrics.service";
import { NotificationOutboxService } from "./outbox/notification/notification-outbox.service";
import { IdentityClient } from "src/clients/identity/identity.client";
import { EventClient } from "src/clients/catalog/event.client";
import { LoggerService } from "../../common/logger/logger.service";
export declare class BookingService {
    private readonly connection;
    private readonly bookingRepo;
    private readonly notificationOutboxService;
    private readonly identityClient;
    private readonly eventClient;
    private readonly redis;
    private readonly eventEmitter;
    private readonly outboxService;
    private readonly pinoLogger;
    private readonly matricsService;
    constructor(connection: Connection, bookingRepo: BookingRepository, notificationOutboxService: NotificationOutboxService, identityClient: IdentityClient, eventClient: EventClient, redis: RedisService, eventEmitter: EventEmitter2, outboxService: OutboxService, pinoLogger: LoggerService, matricsService: MetricsService);
    createBooking(userId: string, dto: CreateBookingDTO): Promise<{
        bookingId: string;
        status: string;
    }>;
    getAllBookings(page?: number, limit?: number): Promise<any>;
    bookingByFilter(query: BookingQueryDTO): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOneBooking(id: string): Promise<BookingResponseDTO>;
    getEventBookings(eventId: string, page: number, limit: number): Promise<any>;
    getUserBookings(userId: string, page: number, limit: number): Promise<{
        bookings: BookingResponseDTO;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    confirmBookingRequest(bookingId: string, paymentIntentId?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/booking.schema").BookingDocument, {}, {}> & import("./schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    bookingConfirmed(bookingId: string, eventId: string, userId: string): Promise<true | undefined>;
    cancelBookingRequest(bookingId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/booking.schema").BookingDocument, {}, {}> & import("./schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null | undefined>;
    cancelConfirmedBooking(): Promise<void>;
    markBookingRefunded(paymentIntentId: string): Promise<boolean>;
    bookingFailed(bookingId: string): Promise<void>;
    getBookingById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/booking.schema").BookingDocument, {}, {}> & import("./schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findBookingsByEventIdAndPaymentStatus(eventId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/booking.schema").BookingDocument, {}, {}> & import("./schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    private emit;
}
