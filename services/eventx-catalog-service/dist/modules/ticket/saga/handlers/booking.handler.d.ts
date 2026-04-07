import { BookingCreatedPayload } from "src/constants/events/domain-event-payloads";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";
export declare class BookingTicketHandler {
    private readonly ticketService;
    private readonly outboxService;
    constructor(ticketService: TicketService, outboxService: OutboxService);
    handleBookingCreated(data: BookingCreatedPayload): Promise<void>;
    private emit;
}
