"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const event_controller_1 = require("./event.controller");
const event_service_1 = require("./event.service");
const mongoose_1 = require("@nestjs/mongoose");
const event_schema_1 = require("./schema/event.schema");
const event_repository_1 = require("./event.repository");
const redis_module_1 = require("../../redis/redis.module");
const image_queue_module_1 = require("../../queue/event-image/image.queue.module");
const ownership_guard_1 = require("./guards/ownership.guard");
const ticket_module_1 = require("../ticket/ticket.module");
const event_outbox_module_1 = require("./outbox/event-outbox.module");
const event_creation_listener_1 = require("./listeners/event-creation.listener");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Event', schema: event_schema_1.EventSchema }]),
            ticket_module_1.TicketModule,
            event_outbox_module_1.EventOutboxModule,
            image_queue_module_1.ImageQueueModule,
            redis_module_1.MyRedisModule
        ],
        controllers: [event_controller_1.EventController],
        providers: [
            event_service_1.EventService,
            event_repository_1.EventRepository,
            ownership_guard_1.EventOwnerShipGuard,
            event_creation_listener_1.TicketConsumer
        ],
        exports: [event_service_1.EventService, event_repository_1.EventRepository, mongoose_1.MongooseModule]
    })
], EventModule);
//# sourceMappingURL=event.module.js.map