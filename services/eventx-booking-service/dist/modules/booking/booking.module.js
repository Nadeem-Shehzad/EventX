"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_controller_1 = require("./booking.controller");
const booking_service_1 = require("./booking.service");
const mongoose_1 = require("@nestjs/mongoose");
const booking_schema_1 = require("./schema/booking.schema");
const booking_repository_1 = require("./repository/booking.repository");
const payment_module_1 = require("../payment/payment.module");
const redis_module_1 = require("../../redis/redis.module");
const booking_cache_listener_1 = require("./listeners/booking-cache-listener");
const outbox_module_1 = require("../../outbox/outbox.module");
const booking_saga_processor_1 = require("./saga/booking-saga.processor");
const booking_saga_service_1 = require("./saga/booking-saga.service");
const ticket_handler_1 = require("./saga/handlers/ticket.handler");
const booking_handler_1 = require("./saga/handlers/booking.handler");
const logging_module_1 = require("../../logging/logging.module");
const monitoring_module_1 = require("../../monitoring/monitoring.module");
const notification_outbox_module_1 = require("./outbox/notification/notification-outbox.module");
const identity_module_1 = require("../../clients/identity/identity.module");
const catalog_module_1 = require("../../clients/catalog/catalog.module");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Booking', schema: booking_schema_1.BookingSchema }]),
            logging_module_1.LoggingModule,
            monitoring_module_1.MonitoringModule,
            outbox_module_1.OutboxModule,
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            redis_module_1.MyRedisModule,
            notification_outbox_module_1.NotificationOutboxModule,
            catalog_module_1.EventClientModule,
            identity_module_1.IdentityModule
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [
            booking_service_1.BookingService,
            booking_repository_1.BookingRepository,
            booking_cache_listener_1.BookingCacheListener,
            booking_saga_processor_1.BookingSagaProcessor,
            booking_saga_service_1.BookingSagaService,
            ticket_handler_1.TicketsBookingHandler,
            booking_handler_1.BookingsHandler
        ],
        exports: [booking_service_1.BookingService]
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map