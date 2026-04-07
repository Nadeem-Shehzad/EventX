import { Job } from "bullmq";
import { BookingTicketHandler } from "./handlers/booking.handler";
import { TicketHandler } from "./handlers/ticket.handler";
export declare class TicketSagaService {
    private readonly bookingHandler;
    private readonly ticketHandler;
    constructor(bookingHandler: BookingTicketHandler, ticketHandler: TicketHandler);
    handle(job: Job): Promise<void>;
}
