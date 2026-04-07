import { Job } from "bullmq";
import { TicketsBookingHandler } from "./handlers/ticket.handler";
import { BookingsHandler } from "./handlers/booking.handler";
export declare class BookingSagaService {
    private readonly ticketHandler;
    private readonly bookingHandler;
    constructor(ticketHandler: TicketsBookingHandler, bookingHandler: BookingsHandler);
    handle(job: Job): Promise<void>;
}
