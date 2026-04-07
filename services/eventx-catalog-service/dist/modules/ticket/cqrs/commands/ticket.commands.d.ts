export declare class ReserveTicketCommand {
    readonly ticketTypeId: string;
    readonly quantity: number;
    readonly session?: any | undefined;
    constructor(ticketTypeId: string, quantity: number, session?: any | undefined);
}
export declare class ConfirmTicketCommand {
    readonly ticketTypeId: string;
    readonly quantity: number;
    readonly session?: any | undefined;
    constructor(ticketTypeId: string, quantity: number, session?: any | undefined);
}
export declare class ReleasedReservedTicketCommand {
    readonly ticketTypeId: string;
    readonly quantity: number;
    readonly session?: any | undefined;
    constructor(ticketTypeId: string, quantity: number, session?: any | undefined);
}
