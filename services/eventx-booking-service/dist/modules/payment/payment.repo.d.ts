import { ClientSession, Model, Types } from 'mongoose';
import { Payment } from './payment.schema';
import { PaymentStatus } from 'src/constants/payment-status.enum';
export declare class PaymentRepository {
    private readonly paymentModel;
    constructor(paymentModel: Model<Payment>);
    create(data: {
        userId: Types.ObjectId;
        bookingId: Types.ObjectId;
        stripePaymentIntentId: string;
        amount: number;
        currency: string;
        status: PaymentStatus;
    }, session?: ClientSession): Promise<import("mongoose").Document<unknown, {}, Payment, {}, {}> & Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findOne(query: {
        bookingId?: Types.ObjectId;
        stripePaymentIntentId?: string;
        status?: {
            $in: PaymentStatus[];
        };
    }): Promise<(import("mongoose").Document<unknown, {}, Payment, {}, {}> & Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    findByPaymentIntentId(stripePaymentIntentId: string): Promise<(import("mongoose").Document<unknown, {}, Payment, {}, {}> & Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
