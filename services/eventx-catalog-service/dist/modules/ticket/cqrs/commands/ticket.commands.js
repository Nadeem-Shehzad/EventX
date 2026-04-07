"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleasedReservedTicketCommand = exports.ConfirmTicketCommand = exports.ReserveTicketCommand = void 0;
class ReserveTicketCommand {
    ticketTypeId;
    quantity;
    session;
    constructor(ticketTypeId, quantity, session) {
        this.ticketTypeId = ticketTypeId;
        this.quantity = quantity;
        this.session = session;
    }
}
exports.ReserveTicketCommand = ReserveTicketCommand;
class ConfirmTicketCommand {
    ticketTypeId;
    quantity;
    session;
    constructor(ticketTypeId, quantity, session) {
        this.ticketTypeId = ticketTypeId;
        this.quantity = quantity;
        this.session = session;
    }
}
exports.ConfirmTicketCommand = ConfirmTicketCommand;
class ReleasedReservedTicketCommand {
    ticketTypeId;
    quantity;
    session;
    constructor(ticketTypeId, quantity, session) {
        this.ticketTypeId = ticketTypeId;
        this.quantity = quantity;
        this.session = session;
    }
}
exports.ReleasedReservedTicketCommand = ReleasedReservedTicketCommand;
//# sourceMappingURL=ticket.commands.js.map