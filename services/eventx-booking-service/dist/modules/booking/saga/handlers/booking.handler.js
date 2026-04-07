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
var BookingsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsHandler = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../../constants/events/domain-events");
const outbox_service_1 = require("../../../../outbox/outbox.service");
const booking_service_1 = require("../../booking.service");
const domain_aggregate_1 = require("../../../../constants/events/domain-aggregate");
const logging_service_1 = require("../../../../logging/logging.service");
let BookingsHandler = BookingsHandler_1 = class BookingsHandler {
    constructor(bookingService, outboxService, logger) {
        this.bookingService = bookingService;
        this.outboxService = outboxService;
        this.logger = logger;
    }
    async handleBookingConfirmedRequest(data) {
        this.logger.info({
            module: 'Booking',
            service: BookingsHandler_1.name,
            msg: 'Inside handleBookingConfirmedRequest',
            bookingId: data.bookingId,
        });
        const { bookingId } = data;
        const booking = await this.bookingService.confirmBookingRequest(bookingId, data.paymentIntent);
        if (!booking) {
            throw new Error('Booking not Confirmed');
        }
        const payload = {
            bookingId: booking._id.toString(),
            userId: booking.userId.toString(),
            eventId: booking.eventId.toString(),
            ticketTypeId: booking.ticketTypeId.toString(),
            quantity: booking.quantity
        };
        await this.emit(domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRMED, bookingId, payload);
    }
    async handleBookingConfirmedFailed(data) {
        this.logger.info({
            module: 'Booking',
            service: BookingsHandler_1.name,
            msg: 'Inside handleBookingConfirmedFailed ',
            bookingId: data.bookingId,
        });
        const { bookingId } = data;
        const booking = await this.bookingService.cancelBookingRequest(bookingId);
        if (!booking) {
            throw new Error('Booking not Cancelled');
        }
        if (booking.paymentIntentId) {
            const payload = {
                bookingId: bookingId,
                paymentIntent: booking.paymentIntentId
            };
            await this.emit(domain_events_1.DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST, bookingId, payload);
            return;
        }
        const payload = {};
        await this.emit(domain_events_1.DOMAIN_EVENTS.BOOKING_CANCELLED, bookingId, payload);
    }
    async handleBookingConfirmed(data) {
        this.logger.info({
            module: 'Booking',
            service: BookingsHandler_1.name,
            msg: 'Inside handleBookingConfirmed',
            eventId: data.eventId,
            bookingId: data.bookingId,
            ticketId: data.ticketTypeId
        });
        const { bookingId, eventId, userId } = data;
        await this.bookingService.bookingConfirmed(bookingId, eventId, userId);
    }
    async handleBookingPaymentFailed(data) {
        this.logger.info({
            module: 'Booking',
            service: BookingsHandler_1.name,
            msg: 'Inside handleBookingPaymentFailed',
            bookingId: data.bookingId
        });
        const { bookingId } = data;
        await this.bookingService.cancelBookingRequest(bookingId);
    }
    async handleBookingPaymentRefunded(data) {
        this.logger.info({
            module: 'Booking',
            service: BookingsHandler_1.name,
            msg: 'Inside handleBookingPaymentRefunded',
            bookingId: data.bookingId
        });
        const { bookingId } = data;
        await this.bookingService.markBookingRefunded(bookingId);
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.BOOKING, aggregateId, event, payload);
    }
};
exports.BookingsHandler = BookingsHandler;
exports.BookingsHandler = BookingsHandler = BookingsHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        outbox_service_1.OutboxService,
        logging_service_1.AppLogger])
], BookingsHandler);
//# sourceMappingURL=booking.handler.js.map