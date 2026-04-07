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
var TicketsBookingHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsBookingHandler = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../../constants/events/domain-events");
const outbox_service_1 = require("../../../../outbox/outbox.service");
const booking_service_1 = require("../../booking.service");
const domain_aggregate_1 = require("../../../../constants/events/domain-aggregate");
const logging_service_1 = require("../../../../logging/logging.service");
let TicketsBookingHandler = TicketsBookingHandler_1 = class TicketsBookingHandler {
    constructor(bookingService, outboxService, logger) {
        this.bookingService = bookingService;
        this.outboxService = outboxService;
        this.logger = logger;
    }
    async handleTicketsReserved(data) {
        const { bookingId, quantity, price } = data;
        this.logger.info({
            module: 'Booking',
            service: TicketsBookingHandler_1.name,
            msg: 'Inside handleTicketRserved',
            bookingId: data.bookingId
        });
        try {
            const payload = {
                userId: data.userId.toString(),
                bookingId,
                amount: quantity * price,
                currency: 'PKR'
            };
            await this.emit(domain_events_1.DOMAIN_EVENTS.PAYMENT_REQUEST, bookingId, payload);
        }
        catch (error) {
            throw error;
        }
    }
    async handleTicketsFailed(data) {
        this.logger.info({
            module: 'Booking',
            service: TicketsBookingHandler_1.name,
            msg: 'Inside handleTicketsFailed',
        });
        console.log('---------------- INSIDE HANDLE-TICKETS-FAILED --------------');
        const { bookingId, reason } = data;
        await this.bookingService.bookingFailed(bookingId);
    }
    async handleTicketsReservationFailed(data) {
        this.logger.info({
            module: 'Booking',
            service: TicketsBookingHandler_1.name,
            msg: 'Inside handleTicketsFailed',
        });
        console.log('---------------- INSIDE HANDLE-TICKETS-RESERVATION-FAILED --------------');
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.PAYMENT, aggregateId, event, payload);
    }
};
exports.TicketsBookingHandler = TicketsBookingHandler;
exports.TicketsBookingHandler = TicketsBookingHandler = TicketsBookingHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        outbox_service_1.OutboxService,
        logging_service_1.AppLogger])
], TicketsBookingHandler);
//# sourceMappingURL=ticket.handler.js.map