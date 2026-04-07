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
var BookingPaymentHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingPaymentHandler = void 0;
const common_1 = require("@nestjs/common");
const domain_aggregate_1 = require("../../../../constants/events/domain-aggregate");
const domain_events_1 = require("../../../../constants/events/domain-events");
const logging_service_1 = require("../../../../logging/logging.service");
const outbox_service_1 = require("../../../../outbox/outbox.service");
const payment_service_1 = require("../../payment.service");
const circuit_breaker_service_1 = require("../../../../circuit-breaker/circuit-breaker.service");
let BookingPaymentHandler = BookingPaymentHandler_1 = class BookingPaymentHandler {
    constructor(paymentService, outboxService, logger, circuitBreaker) {
        this.paymentService = paymentService;
        this.outboxService = outboxService;
        this.logger = logger;
        this.circuitBreaker = circuitBreaker;
        this.breaker = this.circuitBreaker.create('stripe-payment', this.paymentService.createPayment.bind(this.paymentService));
    }
    async handleBookingPaymentRequest(data) {
        this.logger.info({
            module: 'Payment',
            service: BookingPaymentHandler_1.name,
            msg: 'Inside handleBookingPaymentRequest',
            bookingId: data.bookingId,
        });
        try {
            const paymentData = await this.breaker.fire({
                userId: data.userId,
                bookingId: data.bookingId,
                amount: data.amount,
                currency: data.currency
            });
            const payload = {
                bookingId: data.bookingId,
                paymentIntent: paymentData.paymentIntentId
            };
            await this.emit(domain_events_1.DOMAIN_EVENTS.TICKET_SOLD, data.bookingId, payload);
        }
        catch (error) {
            if (this.breaker.opened) {
                this.logger.error({
                    module: 'Payment',
                    service: BookingPaymentHandler_1.name,
                    msg: '🔴 Circuit OPEN — triggering compensation immediately',
                    bookingId: data.bookingId,
                });
                await this.emit(domain_events_1.DOMAIN_EVENTS.PAYMENT_FAILED, data.bookingId, {
                    bookingId: data.bookingId,
                    reason: 'Payment service unavailable'
                });
                return;
            }
            this.logger.error({
                module: 'Payment',
                service: BookingPaymentHandler_1.name,
                msg: 'Payment failed — will retry',
                bookingId: data.bookingId,
                error: error.message
            });
            throw error;
        }
    }
    async handleBookingPaymentFailed(data) {
        this.logger.info({
            module: 'Payment',
            service: BookingPaymentHandler_1.name,
            msg: 'Inside handleBookingPaymentFailed',
            bookingId: data.bookingId,
        });
        const payload = { bookingId: data.bookingId };
        await this.emit(domain_events_1.DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED, data.bookingId, payload);
    }
    async handleBookingPaymentRefundRequest(data) {
        this.logger.info({
            module: 'Payment',
            service: BookingPaymentHandler_1.name,
            msg: 'Inside handleBookingPaymentRefundRequest',
            bookingId: data.bookingId,
        });
        try {
            await this.paymentService.refundBookingPayment(data.bookingId);
            const payload = { bookingId: data.bookingId };
            await this.emit(domain_events_1.DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED, data.bookingId, payload);
        }
        catch (error) {
            this.logger.error({
                module: 'Payment',
                service: BookingPaymentHandler_1.name,
                msg: 'Refund failed — will retry via BullMQ',
                bookingId: data.bookingId,
                error: error.message
            });
            throw error;
        }
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.BOOKING, aggregateId, event, payload);
    }
};
exports.BookingPaymentHandler = BookingPaymentHandler;
exports.BookingPaymentHandler = BookingPaymentHandler = BookingPaymentHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        outbox_service_1.OutboxService,
        logging_service_1.AppLogger,
        circuit_breaker_service_1.CircuitBreakerService])
], BookingPaymentHandler);
//# sourceMappingURL=booking.handler.js.map