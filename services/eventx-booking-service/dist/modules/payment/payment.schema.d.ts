import { Types } from "mongoose";
import { PaymentStatus } from "src/constants/payment-status.enum";
export declare class Payment {
    userId: Types.ObjectId;
    bookingId: Types.ObjectId;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paidAt?: Date;
    failureReason?: string;
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, import("mongoose").Document<unknown, any, Payment, any, {}> & Payment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Payment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
