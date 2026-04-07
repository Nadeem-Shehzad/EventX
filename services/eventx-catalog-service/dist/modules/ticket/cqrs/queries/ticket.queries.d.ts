export declare class GetTicketsByEventQuery {
    readonly eventId: string;
    constructor(eventId: string);
}
export declare class GetTicketByIdQuery {
    readonly ticketTypeId: string;
    constructor(ticketTypeId: string);
}
export declare class CheckAvailabilityQuery {
    readonly ticketTypeId: string;
    readonly quantity: number;
    constructor(ticketTypeId: string, quantity: number);
}
