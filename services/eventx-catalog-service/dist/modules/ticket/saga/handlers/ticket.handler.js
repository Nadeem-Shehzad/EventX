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
exports.TicketHandler = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../../constants/events/domain-events");
const outbox_service_1 = require("../../../../outbox/outbox.service");
const ticket_service_1 = require("../../ticket.service");
const booking_client_1 = require("../../../../clients/booking/booking.client");
let TicketHandler = class TicketHandler {
    ticketService;
    outboxService;
    bookingClient;
    constructor(ticketService, outboxService, bookingClient) {
        this.ticketService = ticketService;
        this.outboxService = outboxService;
        this.bookingClient = bookingClient;
    }
    async handleTicketSold(data) {
        try {
            const { bookingId } = data;
            const bookingResponse = await this.bookingClient.findBookingById(bookingId);
            if (!bookingResponse) {
                throw new common_1.NotFoundException('TicketSold ::: Booking Not Found');
            }
            const booking = bookingResponse.data;
            const ticket = await this.ticketService.confirmReservedTickets(booking.ticketTypeId, booking.quantity, undefined);
            const payload = { bookingId };
            await this.emit(domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, bookingId, payload);
        }
        catch (error) {
            console.log('===============');
            console.log(error.message);
            console.log('===============');
            const { bookingId } = data;
            await this.emit(domain_events_1.DOMAIN_EVENTS.TICKET_SOLD_FAILED, bookingId, null);
        }
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent('Ticket', aggregateId, event, payload);
    }
};
exports.TicketHandler = TicketHandler;
exports.TicketHandler = TicketHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_service_1.TicketService,
        outbox_service_1.OutboxService,
        booking_client_1.BookingClient])
], TicketHandler);
//# sourceMappingURL=ticket.handler.js.map