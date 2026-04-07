"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModule = void 0;
const common_1 = require("@nestjs/common");
const ticket_controller_1 = require("./ticket.controller");
const ticket_service_1 = require("./ticket.service");
const ticket_repository_1 = require("./ticket.repository");
const mongoose_1 = require("@nestjs/mongoose");
const ticket_type_schema_1 = require("./schema/ticket-type.schema");
const outbox_module_1 = require("../../outbox/outbox.module");
const ticket_saga_processor_1 = require("./saga/ticket-saga.processor");
const ticket_saga_service_1 = require("./saga/ticket-saga.service");
const booking_handler_1 = require("./saga/handlers/booking.handler");
const ticket_handler_1 = require("./saga/handlers/ticket.handler");
const booking_client_module_1 = require("../../clients/booking/booking.client.module");
const reserve_ticket_handler_1 = require("./cqrs/handlers/commands/reserve-ticket.handler");
const cqrs_1 = require("@nestjs/cqrs");
const confirm_ticket_handler_1 = require("./cqrs/handlers/commands/confirm-ticket.handler");
const release_ticket_handler_1 = require("./cqrs/handlers/commands/release-ticket.handler");
const redis_module_1 = require("../../redis/redis.module");
const event_tickets_handler_1 = require("./cqrs/handlers/queries/event-tickets.handler");
const ticket_by_id_handler_1 = require("./cqrs/handlers/queries/ticket-by-id.handler");
const check_availability_handler_1 = require("./cqrs/handlers/queries/check-availability.handler");
const CommandHandlers = [
    reserve_ticket_handler_1.ReserveTicketHandler,
    confirm_ticket_handler_1.ConfirmTicketHandler,
    release_ticket_handler_1.ReleaseReservedTicketHandler
];
const QueryHandlers = [
    event_tickets_handler_1.GetTicketsByEventHandler,
    ticket_by_id_handler_1.TicketByIDHandler,
    check_availability_handler_1.CheckAvailabilityHandler
];
let TicketModule = class TicketModule {
};
exports.TicketModule = TicketModule;
exports.TicketModule = TicketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'TicketType', schema: ticket_type_schema_1.TicketTypeSchema }]),
            outbox_module_1.OutboxModule,
            booking_client_module_1.BookingClientModule,
            redis_module_1.MyRedisModule
        ],
        controllers: [ticket_controller_1.TicketController],
        providers: [
            ticket_service_1.TicketService,
            ticket_repository_1.TicketRepository,
            ticket_saga_processor_1.TicketSagaProcessor,
            ticket_saga_service_1.TicketSagaService,
            booking_handler_1.BookingTicketHandler,
            ticket_handler_1.TicketHandler,
            ...CommandHandlers,
            ...QueryHandlers,
        ],
        exports: [ticket_service_1.TicketService]
    })
], TicketModule);
//# sourceMappingURL=ticket.module.js.map