"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingTicketHandler = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../../constants/events/domain-events");
const outbox_service_1 = require("../../../../outbox/outbox.service");
const ticket_service_1 = require("../../ticket.service");
let BookingTicketHandler = class BookingTicketHandler {
    ticketService;
    outboxService;
    constructor(ticketService, outboxService) {
        this.ticketService = ticketService;
        this.outboxService = outboxService;
    }
    async handleBookingCreated(data) {
        try {
            const { userId, bookingId, ticketTypeId, quantity } = data;
            const ticket = await this.ticketService.reserveTickets(ticketTypeId, quantity, undefined);
            const payload = {
                userId,
                bookingId,
                ticketTypeId,
                isPaid: ticket.isPaidEvent,
                quantity,
                price: ticket.price
            };
            if (!ticket.isPaidEvent) {
                const payload = { bookingId };
                await this.emit(domain_events_1.DOMAIN_EVENTS.TICKET_SOLD, bookingId, payload);
            }
            else {
                await this.emit(domain_events_1.DOMAIN_EVENTS.TICKET_RESERVED, bookingId, payload);
            }
        }
        catch (error) {
            const { bookingId } = data;
            await this.emit(domain_events_1.DOMAIN_EVENTS.TICKET_RESERVATION_FAILED, bookingId, { bookingId });
        }
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent('Ticket', aggregateId, event, payload);
    }
};
exports.BookingTicketHandler = BookingTicketHandler;
exports.BookingTicketHandler = BookingTicketHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_service_1.TicketService,
        outbox_service_1.OutboxService])
], BookingTicketHandler);
//# sourceMappingURL=booking.handler.js.map