"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationOutboxModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_outbox_schema_1 = require("./notification-outbox.schema");
const notification_outbox_repo_1 = require("./notification-outbox.repo");
const notification_outbox_processor_1 = require("./notification-outbox.processor");
const notification_outbox_service_1 = require("./notification-outbox.service");
let NotificationOutboxModule = class NotificationOutboxModule {
};
exports.NotificationOutboxModule = NotificationOutboxModule;
exports.NotificationOutboxModule = NotificationOutboxModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: notification_outbox_schema_1.NotificationOutbox.name,
                    schema: notification_outbox_schema_1.NotificationOutboxSchema
                }]),
        ],
        providers: [
            notification_outbox_repo_1.NotificationOutboxRepo,
            notification_outbox_service_1.NotificationOutboxService,
            notification_outbox_processor_1.NotificationOutboxProcessor,
        ],
        exports: [notification_outbox_service_1.NotificationOutboxService]
    })
], NotificationOutboxModule);
//# sourceMappingURL=notification-outbox.module.js.map