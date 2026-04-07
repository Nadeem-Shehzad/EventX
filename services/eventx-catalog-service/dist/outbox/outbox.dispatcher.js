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
var OutboxDispatcher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxDispatcher = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const queue_constants_1 = require("../queue/queue.constants");
const domain_events_1 = require("../constants/events/domain-events");
const outbox_service_1 = require("./outbox.service");
let OutboxDispatcher = OutboxDispatcher_1 = class OutboxDispatcher {
    outboxService;
    bookingQueue;
    ticketQueue;
    isProcessing = false;
    changeStream;
    logger = new common_1.Logger(OutboxDispatcher_1.name);
    constructor(outboxService, bookingQueue, ticketQueue) {
        this.outboxService = outboxService;
        this.bookingQueue = bookingQueue;
        this.ticketQueue = ticketQueue;
    }
    async onModuleInit() {
        await this.startChangeStream();
    }
    async onModuleDestroy() {
        if (this.changeStream) {
            await this.changeStream.close();
            this.logger.log('OutboxDispatcher Change Stream closed');
        }
    }
    async startChangeStream() {
        const model = this.outboxService.getModel();
        this.changeStream = model.watch([{ $match: { operationType: 'insert' } }], { fullDocument: 'updateLookup' });
        this.logger.log('OutboxDispatcher Change Stream started');
        this.changeStream.on('change', async (change) => {
            const event = change.fullDocument;
            this.logger.log(`New outbox event detected: ${event.eventType}`);
            await this.processEvent(event);
        });
        this.changeStream.on('error', (error) => {
            this.logger.error(`Change Stream error: ${error.message}`);
        });
    }
    async processEvent(event) {
        const { eventType, payload, _id } = event;
        await this.outboxService.markDispatched(event._id.toString());
        if (eventType === domain_events_1.DOMAIN_EVENTS.TICKET_RESERVED ||
            eventType === domain_events_1.DOMAIN_EVENTS.TICKET_RESERVATION_FAILED ||
            eventType === domain_events_1.DOMAIN_EVENTS.TICKET_FAILED ||
            eventType === domain_events_1.DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED) {
            await this.bookingQueue.add(eventType, payload, this.jobOptions(_id.toString()));
        }
        else if (eventType === domain_events_1.DOMAIN_EVENTS.TICKET_SOLD) {
            await this.ticketQueue.add(eventType, payload, this.jobOptions(_id.toString()));
        }
    }
    jobOptions(id) {
        return {
            jobId: id,
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
            removeOnFail: false,
        };
    }
};
exports.OutboxDispatcher = OutboxDispatcher;
exports.OutboxDispatcher = OutboxDispatcher = OutboxDispatcher_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUES.BOOKING_QUEUE)),
    __param(2, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUES.TICKET_QUEUE)),
    __metadata("design:paramtypes", [outbox_service_1.OutboxService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], OutboxDispatcher);
//# sourceMappingURL=outbox.dispatcher.js.map