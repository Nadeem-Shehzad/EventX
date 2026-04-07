import { TicketsReservedFailedPayload, TicketsReservedPayload } from "src/constants/events/domain-event-payloads";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AppLogger } from "src/logging/logging.service";
export declare class TicketsBookingHandler {
    private readonly bookingService;
    private readonly outboxService;
    private readonly logger;
    constructor(bookingService: BookingService, outboxService: OutboxService, logger: AppLogger);
    handleTicketsReserved(data: TicketsReservedPayload): Promise<void>;
    handleTicketsFailed(data: TicketsReservedFailedPayload): Promise<void>;
    handleTicketsReservationFailed(data: TicketsReservedFailedPayload): Promise<void>;
    private emit;
}
