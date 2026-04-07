import { PaymentService } from './payment.service';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    testPayment(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    refundBookingPayment(bookingId: string): Promise<unknown>;
    refundEventPayment(eventId: string): Promise<{
        refunds: {
            bookingId: any;
            refund: any;
        }[];
        failed: {
            bookingId: any;
            reason: string;
        }[];
    }>;
    stripeWebhook(req: Request & {
        rawBody: Buffer;
    }, res: Response, signature: string): Promise<void>;
}
