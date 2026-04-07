"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuesModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const email_queue_module_1 = require("./email/email.queue.module");
const image_queue_module_1 = require("./event-image/image.queue.module");
const event_queue_module_1 = require("./event/event.queue.module");
const isTest = process.env.NODE_ENV === 'test';
let QueuesModule = class QueuesModule {
};
exports.QueuesModule = QueuesModule;
exports.QueuesModule = QueuesModule = __decorate([
    (0, common_1.Module)({
        imports: isTest ? [] :
            [
                bullmq_1.BullModule.forRoot({
                    connection: {
                        host: 'localhost',
                        port: 6379
                    }
                }),
                image_queue_module_1.ImageQueueModule,
                email_queue_module_1.EmailQueueModule,
                event_queue_module_1.EventQueueModule
            ],
        exports: isTest ? [] : [bullmq_1.BullModule]
    })
], QueuesModule);
//# sourceMappingURL=queues.module.js.map