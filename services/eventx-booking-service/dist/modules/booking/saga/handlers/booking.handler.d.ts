import { BookingConfirmedFailedPayload, BookingConfirmedPayload, BookingConfirmedRequestPayload } from "src/constants/events/domain-event-payloads";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AppLogger } from "src/logging/logging.service";
export declare class BookingsHandler {
    private readonly bookingService;
    private readonly outboxService;
    private readonly logger;
    constructor(bookingService: BookingService, outboxService: OutboxService, logger: AppLogger);
    handleBookingConfirmedRequest(data: BookingConfirmedRequestPayload): Promise<void>;
    handleBookingConfirmedFailed(data: BookingConfirmedFailedPayload): Promise<void>;
    handleBookingConfirmed(data: BookingConfirmedPayload): Promise<void>;
    handleBookingPaymentFailed(data: BookingConfirmedRequestPayload): Promise<void>;
    handleBookingPaymentRefunded(data: BookingConfirmedRequestPayload): Promise<void>;
    private emit;
}
