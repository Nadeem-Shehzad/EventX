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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_service_1 = require("../booking/booking.service");
const payment_status_enum_1 = require("../../constants/payment-status.enum");
const stripe_service_1 = require("../../stripe/stripe.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const outbox_service_1 = require("../../outbox/outbox.service");
const logging_service_1 = require("../../logging/logging.service");
const payment_repo_1 = require("./payment.repo");
const circuit_breaker_service_1 = require("../../circuit-breaker/circuit-breaker.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(connection, stripe, paymentRepo, bookingService, eventEmitter, outboxService, logger, circuitBreakerService) {
        this.connection = connection;
        this.stripe = stripe;
        this.paymentRepo = paymentRepo;
        this.bookingService = bookingService;
        this.eventEmitter = eventEmitter;
        this.outboxService = outboxService;
        this.logger = logger;
        this.circuitBreakerService = circuitBreakerService;
        this.refundBreaker = this.circuitBreakerService.create('stripe-refund', this.stripe.refundPayment.bind(this.stripe));
    }
    async createPayment(params) {
        const existingPayment = await this.paymentRepo.findOne({
            bookingId: new mongoose_2.Types.ObjectId(params.bookingId),
            status: {
                $in: [payment_status_enum_1.PaymentStatus.PENDING, payment_status_enum_1.PaymentStatus.COMPLETED]
            }
        });
        if (existingPayment) {
            return {
                paymentIntentId: existingPayment.stripePaymentIntentId,
                clientSecret: null
            };
        }
        const amountInCents = Math.round(params.amount * 100);
        const paymentIntent = await this.stripe.createPaymentIntent({
            amount: amountInCents,
            currency: params.currency.toLowerCase(),
            metadata: {
                bookingId: params.bookingId,
                userId: params.userId
            }
        }, params.bookingId);
        await this.paymentRepo.create({
            userId: new mongoose_2.Types.ObjectId(params.userId),
            bookingId: new mongoose_2.Types.ObjectId(params.bookingId),
            stripePaymentIntentId: paymentIntent.id,
            amount: params.amount,
            currency: params.currency,
            status: payment_status_enum_1.PaymentStatus.PENDING
        });
        return {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret
        };
    }
    async testPayment(paymentIntentId) {
        return await this.stripe.confirmTestPayment(paymentIntentId);
    }
    async refundBookingPayment(bookingId) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (!booking || booking.paymentStatus !== 'SUCCEEDED' || !booking.paymentIntentId) {
            throw new common_1.BadRequestException('Booking not eligible for refund');
        }
        try {
            const refund = await this.refundBreaker.fire(booking.paymentIntentId);
            this.logger.info({
                module: 'Payment',
                service: PaymentService_1.name,
                msg: `Refund successful for booking: ${bookingId}`,
            });
            return refund;
        }
        catch (error) {
            if (this.refundBreaker.opened) {
                this.logger.error({
                    module: 'Payment',
                    service: PaymentService_1.name,
                    msg: '🔴 Refund circuit OPEN — Stripe refund service unavailable',
                    bookingId,
                });
                throw error;
            }
            this.logger.error({
                module: 'Payment',
                service: PaymentService_1.name,
                msg: `Refund failed for booking: ${bookingId}`,
                error: error.message
            });
            throw error;
        }
    }
    async refundEventPayment(eventId) {
        const refunds = [];
        const failed = [];
        const bookings = await this.bookingService.findBookingsByEventIdAndPaymentStatus(eventId);
        for (const booking of bookings) {
            if (!booking.paymentIntentId)
                continue;
            if (this.refundBreaker.opened) {
                this.logger.error({
                    module: 'Payment',
                    service: PaymentService_1.name,
                    msg: `🔴 Refund circuit OPEN — stopping bulk refund at booking: ${booking._id}`,
                });
                failed.push({ bookingId: booking._id, reason: 'Stripe refund service unavailable' });
                continue;
            }
            try {
                const refund = await this.refundBreaker.fire(booking.paymentIntentId);
                booking.paymentStatus = payment_status_enum_1.PaymentStatus.REFUNDED;
                await booking.save();
                refunds.push({ bookingId: booking._id, refund });
            }
            catch (error) {
                this.logger.error({
                    module: 'Payment',
                    service: PaymentService_1.name,
                    msg: `Refund failed for booking: ${booking._id}`,
                    error: error.message
                });
                failed.push({ bookingId: booking._id, reason: error.message });
            }
        }
        return { refunds, failed };
    }
    async handleStripeWebhook(event) {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata.bookingId;
                await this.bookingService.confirmBookingRequest(bookingId);
                this.logger.info({
                    module: 'Payment',
                    service: 'handleStripeWebhook.payment_intent.succeeded',
                    msg: `Booking ${bookingId} confirmed via payment_intent.succeeded`,
                });
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata.bookingId;
                await this.bookingService.cancelBookingRequest(bookingId);
                this.logger.error({
                    module: 'Payment',
                    service: 'handleStripeWebhook.payment_intent.payment_failed',
                    msg: `Booking ${bookingId} cancelled due to payment failure`,
                });
                break;
            }
            case 'charge.refunded': {
                const refund = event.data.object;
                const paymentIntentId = refund.payment_intent;
                await this.bookingService.markBookingRefunded(paymentIntentId);
                this.logger.error({
                    module: 'Payment',
                    service: 'handleStripeWebhook.charge.refunded',
                    msg: `Booking with ${paymentIntentId} refunded`,
                });
                break;
            }
            default:
                this.logger.error({
                    module: 'Payment',
                    service: 'handleStripeWebhook.default',
                    msg: `Unhandled Stripe event: ${event.type}`,
                });
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_service_1.BookingService))),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        stripe_service_1.StripeService,
        payment_repo_1.PaymentRepository,
        booking_service_1.BookingService,
        event_emitter_1.EventEmitter2,
        outbox_service_1.OutboxService,
        logging_service_1.AppLogger,
        circuit_breaker_service_1.CircuitBreakerService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map