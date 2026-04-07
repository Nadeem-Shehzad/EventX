import { BookingConfirmedFailedPayload, PaymentFailedPayload, PaymentRequestPayload } from "src/constants/events/domain-event-payloads";
import { AppLogger } from "src/logging/logging.service";
import { OutboxService } from "src/outbox/outbox.service";
import { PaymentService } from "src/modules/payment/payment.service";
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";
export declare class BookingPaymentHandler {
    private readonly paymentService;
    private readonly outboxService;
    private readonly logger;
    private readonly circuitBreaker;
    private readonly breaker;
    constructor(paymentService: PaymentService, outboxService: OutboxService, logger: AppLogger, circuitBreaker: CircuitBreakerService);
    handleBookingPaymentRequest(data: PaymentRequestPayload): Promise<void>;
    handleBookingPaymentFailed(data: PaymentFailedPayload): Promise<void>;
    handleBookingPaymentRefundRequest(data: BookingConfirmedFailedPayload): Promise<void>;
    private emit;
}
