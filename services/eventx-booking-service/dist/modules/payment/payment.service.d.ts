import { Connection } from "mongoose";
import { BookingService } from "src/modules/booking/booking.service";
import { StripeService } from "src/stripe/stripe.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";
import { PaymentRepository } from "./payment.repo";
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";
export declare class PaymentService {
    private readonly connection;
    private readonly stripe;
    private readonly paymentRepo;
    private readonly bookingService;
    private readonly eventEmitter;
    private readonly outboxService;
    private readonly logger;
    private readonly circuitBreakerService;
    private readonly refundBreaker;
    constructor(connection: Connection, stripe: StripeService, paymentRepo: PaymentRepository, bookingService: BookingService, eventEmitter: EventEmitter2, outboxService: OutboxService, logger: AppLogger, circuitBreakerService: CircuitBreakerService);
    createPayment(params: {
        userId: string;
        bookingId: string;
        amount: number;
        currency: string;
    }): Promise<{
        paymentIntentId: string;
        clientSecret: string | null;
    }>;
    testPayment(paymentIntentId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentIntent>>;
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
    handleStripeWebhook(event: any): Promise<void>;
}
