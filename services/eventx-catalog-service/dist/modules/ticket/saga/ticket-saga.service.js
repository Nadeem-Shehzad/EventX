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
exports.TicketSagaService = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../constants/events/domain-events");
const booking_handler_1 = require("./handlers/booking.handler");
const ticket_handler_1 = require("./handlers/ticket.handler");
let TicketSagaService = class TicketSagaService {
    bookingHandler;
    ticketHandler;
    constructor(bookingHandler, ticketHandler) {
        this.bookingHandler = bookingHandler;
        this.ticketHandler = ticketHandler;
    }
    async handle(job) {
        switch (job.name) {
            case domain_events_1.DOMAIN_EVENTS.BOOKING_CREATED:
                return this.bookingHandler.handleBookingCreated(job.data);
            case domain_events_1.DOMAIN_EVENTS.TICKET_SOLD:
                return this.ticketHandler.handleTicketSold(job.data);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
};
exports.TicketSagaService = TicketSagaService;
exports.TicketSagaService = TicketSagaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_handler_1.BookingTicketHandler,
        ticket_handler_1.TicketHandler])
], TicketSagaService);
//# sourceMappingURL=ticket-saga.service.js.map