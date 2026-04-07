"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventOutboxModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const event_outbox_schema_1 = require("./event-outbox-schema");
const event_outbox_repo_1 = require("./event-outbox-repo");
const event_outbox_service_1 = require("./event-outbox.service");
const event_outbox_processor_1 = require("./event-outbox-processor");
let EventOutboxModule = class EventOutboxModule {
};
exports.EventOutboxModule = EventOutboxModule;
exports.EventOutboxModule = EventOutboxModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: event_outbox_schema_1.EventOutbox.name,
                    schema: event_outbox_schema_1.EventOutboxSchema
                }]),
        ],
        providers: [
            event_outbox_service_1.EventOutboxService,
            event_outbox_repo_1.EventOutboxRepo,
            ...(process.env.NODE_ENV === 'test'
                ? []
                : [event_outbox_processor_1.EventOutboxProcessor]),
        ],
        exports: [event_outbox_service_1.EventOutboxService]
    })
], EventOutboxModule);
//# sourceMappingURL=event-outbox.module.js.map