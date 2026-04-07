import { TicketService } from "./ticket.service";
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    getTicketsByEvent(eventId: string): Promise<any>;
    getTicketById(ticketTypeId: string): Promise<any>;
    checkAvailability(ticketTypeId: string, quantity: number): Promise<any>;
}
