import { Document, Types } from 'mongoose';
import { BookingStatus } from '../enum/booking-status.enum';
import { PaymentStatus } from '../../../constants/payment-status.enum';
export type BookingDocument = Booking & Document & {
    _id: Types.ObjectId;
};
export declare class Booking extends Document {
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    ticketTypeId: Types.ObjectId;
    quantity: number;
    status: BookingStatus;
    amount: number;
    currency: string;
    paymentStatus: PaymentStatus;
    paymentIntentId?: string;
    expiresAt?: Date;
    confirmedAt?: Date;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Booking> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
