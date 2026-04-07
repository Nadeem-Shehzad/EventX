import { TicketsSoldPayload } from "src/constants/events/domain-event-payloads";
import { OutboxService } from "src/outbox/outbox.service";
import { TicketService } from "../../ticket.service";
import { BookingClient } from "src/clients/booking/booking.client";
export declare class TicketHandler {
    private readonly ticketService;
    private readonly outboxService;
    private readonly bookingClient;
    constructor(ticketService: TicketService, outboxService: OutboxService, bookingClient: BookingClient);
    handleTicketSold(data: TicketsSoldPayload): Promise<void>;
    private emit;
}
