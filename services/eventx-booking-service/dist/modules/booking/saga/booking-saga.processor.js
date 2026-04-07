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
var BookingSagaProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSagaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const queue_constants_1 = require("../../../queue/queue.constants");
const booking_saga_service_1 = require("./booking-saga.service");
const domain_aggregate_1 = require("../../../constants/events/domain-aggregate");
const outbox_service_1 = require("../../../outbox/outbox.service");
const logging_service_1 = require("../../../logging/logging.service");
let BookingSagaProcessor = BookingSagaProcessor_1 = class BookingSagaProcessor extends bullmq_1.WorkerHost {
    constructor(sagaService, outboxService, logger) {
        super();
        this.sagaService = sagaService;
        this.outboxService = outboxService;
        this.logger = logger;
        this.failureMap = {};
    }
    async process(job) {
        this.logger.info({
            module: 'Booking',
            service: BookingSagaProcessor_1.name,
            msg: 'Inside Booking-Module-SAGA',
        });
        return this.sagaService.handle(job);
    }
    async onFailed(job, err) {
        const maxAttempts = job.opts.attempts || 1;
        if (job.attemptsMade < maxAttempts) {
            this.logger.warn({
                module: 'Booking',
                service: BookingSagaProcessor_1.name,
                msg: `Job ${job.id} failed (Attempt ${job.attemptsMade} of ${maxAttempts}). Retrying...`,
            });
            return;
        }
        this.logger.error({
            module: 'Booking',
            service: BookingSagaProcessor_1.name,
            msg: `Job ${job.id} failed permanently. Triggering Saga Rollback.`,
        });
        const failureEvent = this.failureMap[job.name];
        if (!failureEvent)
            return;
        await this.emit(failureEvent, job.data.bookingId, {
            bookingId: job.data.bookingId,
            reason: err.message,
        });
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.BOOKING, aggregateId, event, payload);
    }
};
exports.BookingSagaProcessor = BookingSagaProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", Promise)
], BookingSagaProcessor.prototype, "onFailed", null);
exports.BookingSagaProcessor = BookingSagaProcessor = BookingSagaProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUES.BOOKING_QUEUE, {
        concurrency: 20,
        limiter: {
            max: 200,
            duration: 1000
        }
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_saga_service_1.BookingSagaService,
        outbox_service_1.OutboxService,
        logging_service_1.AppLogger])
], BookingSagaProcessor);
//# sourceMappingURL=booking-saga.processor.js.map