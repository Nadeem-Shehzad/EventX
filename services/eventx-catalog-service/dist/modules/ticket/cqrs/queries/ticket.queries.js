"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAvailabilityQuery = exports.GetTicketByIdQuery = exports.GetTicketsByEventQuery = void 0;
class GetTicketsByEventQuery {
    eventId;
    constructor(eventId) {
        this.eventId = eventId;
    }
}
exports.GetTicketsByEventQuery = GetTicketsByEventQuery;
class GetTicketByIdQuery {
    ticketTypeId;
    constructor(ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
    }
}
exports.GetTicketByIdQuery = GetTicketByIdQuery;
class CheckAvailabilityQuery {
    ticketTypeId;
    quantity;
    constructor(ticketTypeId, quantity) {
        this.ticketTypeId = ticketTypeId;
        this.quantity = quantity;
    }
}
exports.CheckAvailabilityQuery = CheckAvailabilityQuery;
//# sourceMappingURL=ticket.queries.js.map