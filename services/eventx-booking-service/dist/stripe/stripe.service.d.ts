import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
export declare class StripeService {
    private readonly stripe;
    private readonly configService;
    constructor(stripe: Stripe, configService: ConfigService);
    createPaymentIntent(params: {
        amount: number;
        currency: string;
        metadata?: Record<string, string>;
    }, idempotencyKey?: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    confirmTestPayment(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    refundPayment(paymentIntentId: string): Promise<Stripe.Response<Stripe.Refund>>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}
