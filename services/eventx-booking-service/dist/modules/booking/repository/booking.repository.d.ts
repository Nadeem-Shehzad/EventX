import { ClientSession, Model, Types } from "mongoose";
import { BookingDocument } from "../schema/booking.schema";
import { BookingStatus } from "../enum/booking-status.enum";
import { PaymentStatus } from "../../../constants/payment-status.enum";
import { BasePipeline } from "src/common/base/base.pipeline";
export declare class BookingRepository extends BasePipeline<BookingDocument> {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    createBooking(data: Partial<BookingDocument>, session: ClientSession): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & import("../schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    checkBookingExists(userId: string, eventId: string, ticketTypeId: string): Promise<(import("mongoose").FlattenMaps<BookingDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    allBookings(page: number, limit: number): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getBookingsByFilter(filter: any, options: {
        limit: number;
        skip: number;
    }): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBookingById(bookingId: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & import("../schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findBookingByPaymentIntentId(paymentIntentId: string, session: ClientSession): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & import("../schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findBookingsByEventIdAndPaymentStatus(eventId: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & import("../schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBookingsByEventId(eventId: string, page: number, limit: number): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBookingsByUserId(userId: string, page: number, limit: number): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(bookingId: string, update: {
        status: BookingStatus;
        paymentStatus: PaymentStatus;
        paymentIntentId?: string | null;
    }, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & import("../schema/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export declare const publicResponseData: {
    _id: {
        $toString: string;
    };
    userId: number;
    eventId: number;
    ticketTypeId: number;
    quantity: number;
    status: number;
    amount: number;
    currency: number;
};
