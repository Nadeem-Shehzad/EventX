"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const stripe_module_1 = require("../../stripe/stripe.module");
const booking_module_1 = require("../booking/booking.module");
const payment_controller_1 = require("./payment.controller");
const outbox_module_1 = require("../../outbox/outbox.module");
const payment_saga_processor_1 = require("./saga/payment-saga.processor");
const payment_saga_service_1 = require("./saga/payment-saga.service");
const booking_handler_1 = require("./saga/handlers/booking.handler");
const logging_module_1 = require("../../logging/logging.module");
const mongoose_1 = require("@nestjs/mongoose");
const payment_schema_1 = require("./payment.schema");
const payment_repo_1 = require("./payment.repo");
const circuit_breaker_service_1 = require("../../circuit-breaker/circuit-breaker.service");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Payment', schema: payment_schema_1.PaymentSchema }]),
            stripe_module_1.StripeModule,
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            logging_module_1.LoggingModule,
            outbox_module_1.OutboxModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [
            payment_repo_1.PaymentRepository,
            payment_service_1.PaymentService,
            payment_saga_processor_1.PaymentSagaProcessor,
            payment_saga_service_1.PaymentSagaService,
            booking_handler_1.BookingPaymentHandler,
            circuit_breaker_service_1.CircuitBreakerService
        ],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map