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
exports.BookingSagaService = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../constants/events/domain-events");
const ticket_handler_1 = require("./handlers/ticket.handler");
const booking_handler_1 = require("./handlers/booking.handler");
let BookingSagaService = class BookingSagaService {
    constructor(ticketHandler, bookingHandler) {
        this.ticketHandler = ticketHandler;
        this.bookingHandler = bookingHandler;
    }
    async handle(job) {
        switch (job.name) {
            case domain_events_1.DOMAIN_EVENTS.TICKET_RESERVED:
                return this.ticketHandler.handleTicketsReserved(job.data);
            case domain_events_1.DOMAIN_EVENTS.TICKET_RESERVATION_FAILED:
                return this.ticketHandler.handleTicketsReservationFailed(job.data);
            case domain_events_1.DOMAIN_EVENTS.TICKET_FAILED:
                return this.ticketHandler.handleTicketsFailed(job.data);
            case domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED:
                return this.bookingHandler.handleBookingConfirmedRequest(job.data);
            case domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRM_FAILED:
                return this.bookingHandler.handleBookingConfirmedFailed(job.data);
            case domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRMED:
                return this.bookingHandler.handleBookingConfirmed(job.data);
            case domain_events_1.DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED:
                return this.bookingHandler.handleBookingPaymentFailed(job.data);
            case domain_events_1.DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED:
                return this.bookingHandler.handleBookingPaymentRefunded(job.data);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
};
exports.BookingSagaService = BookingSagaService;
exports.BookingSagaService = BookingSagaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_handler_1.TicketsBookingHandler,
        booking_handler_1.BookingsHandler])
], BookingSagaService);
//# sourceMappingURL=booking-saga.service.js.map