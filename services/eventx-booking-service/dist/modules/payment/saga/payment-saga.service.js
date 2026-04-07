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
exports.PaymentSagaService = void 0;
const common_1 = require("@nestjs/common");
const domain_events_1 = require("../../../constants/events/domain-events");
const booking_handler_1 = require("./handlers/booking.handler");
let PaymentSagaService = class PaymentSagaService {
    constructor(bookingPaymentHandler) {
        this.bookingPaymentHandler = bookingPaymentHandler;
    }
    async handle(job) {
        switch (job.name) {
            case domain_events_1.DOMAIN_EVENTS.PAYMENT_REQUEST:
                return this.bookingPaymentHandler.handleBookingPaymentRequest(job.data);
            case domain_events_1.DOMAIN_EVENTS.PAYMENT_FAILED:
                return this.bookingPaymentHandler.handleBookingPaymentFailed(job.data);
            case domain_events_1.DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST:
                return this.bookingPaymentHandler.handleBookingPaymentRefundRequest(job.data);
            default:
                throw new Error(`Unknown job ${job.name}`);
        }
    }
};
exports.PaymentSagaService = PaymentSagaService;
exports.PaymentSagaService = PaymentSagaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_handler_1.BookingPaymentHandler])
], PaymentSagaService);
//# sourceMappingURL=payment-saga.service.js.map