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
exports.TicketSagaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const queue_constants_1 = require("../../../queue/queue.constants");
const ticket_saga_service_1 = require("./ticket-saga.service");
const domain_events_1 = require("../../../constants/events/domain-events");
const domain_aggregate_1 = require("../../../constants/events/domain-aggregate");
const outbox_service_1 = require("../../../outbox/outbox.service");
let TicketSagaProcessor = class TicketSagaProcessor extends bullmq_1.WorkerHost {
    sagaService;
    outboxService;
    constructor(sagaService, outboxService) {
        super();
        this.sagaService = sagaService;
        this.outboxService = outboxService;
    }
    async process(job) {
        return this.sagaService.handle(job);
    }
    async onFailed(job, err) {
        const maxAttempts = job.opts.attempts || 1;
        if (job.attemptsMade < maxAttempts) {
            return;
        }
        const failureEvent = this.failureMap[job.name];
        if (!failureEvent)
            return;
        await this.emit(failureEvent, job.data.bookingId, {
            bookingId: job.data.bookingId,
            reason: err.message,
        });
    }
    failureMap = {
        [domain_events_1.DOMAIN_EVENTS.BOOKING_CREATED]: domain_events_1.DOMAIN_EVENTS.TICKET_FAILED,
    };
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.TICKET, aggregateId, event, payload);
    }
};
exports.TicketSagaProcessor = TicketSagaProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", Promise)
], TicketSagaProcessor.prototype, "onFailed", null);
exports.TicketSagaProcessor = TicketSagaProcessor = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUES.TICKET_QUEUE, {
        concurrency: 10,
        limiter: {
            max: 100,
            duration: 1000
        }
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_saga_service_1.TicketSagaService,
        outbox_service_1.OutboxService])
], TicketSagaProcessor);
//# sourceMappingURL=ticket-saga.processor.js.map