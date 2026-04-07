"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventQueueModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const queue_constants_1 = require("../queue.constants");
const isTest = process.env.NODE_ENV === 'test';
let EventQueueModule = class EventQueueModule {
};
exports.EventQueueModule = EventQueueModule;
exports.EventQueueModule = EventQueueModule = __decorate([
    (0, common_1.Module)({
        imports: isTest ? [] :
            [
                bullmq_1.BullModule.registerQueue({ name: queue_constants_1.QUEUES.TICKET_QUEUE }, { name: queue_constants_1.QUEUES.BOOKING_QUEUE })
            ],
        exports: isTest ? [] : [bullmq_1.BullModule],
    })
], EventQueueModule);
//# sourceMappingURL=event.queue.module.js.map