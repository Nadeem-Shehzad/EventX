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
var EventOutboxProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventOutboxProcessor = void 0;
const common_1 = require("@nestjs/common");
const event_outbox_service_1 = require("./event-outbox.service");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
let EventOutboxProcessor = EventOutboxProcessor_1 = class EventOutboxProcessor {
    eventOutboxService;
    amqpConnection;
    logger = new common_1.Logger(EventOutboxProcessor_1.name);
    changeStream;
    constructor(eventOutboxService, amqpConnection) {
        this.eventOutboxService = eventOutboxService;
        this.amqpConnection = amqpConnection;
    }
    async onModuleInit() {
        await this.startChangeStream();
    }
    async onModuleDestroy() {
        if (this.changeStream) {
            await this.changeStream.close();
            this.logger.log('Change Stream closed');
        }
    }
    async startChangeStream() {
        const model = this.eventOutboxService.getModel();
        this.changeStream = model.watch([{ $match: { operationType: 'insert' } }], { fullDocument: 'updateLookup' });
        this.logger.log('Event Outbox Change Stream started');
        this.changeStream.on('change', async (change) => {
            const event = change.fullDocument;
            this.logger.log(`New outbox event detected: ${event.eventType} for ${event.aggregateId}`);
            try {
                await this.amqpConnection.publish('eventx.events', event.eventType, event.payload, {
                    messageId: `${event.eventType}.${event.aggregateId}`,
                    persistent: true,
                });
                await this.eventOutboxService.markPublished(event._id.toString());
                this.logger.log(`Published: ${event.eventType} for ${event.aggregateId}`);
            }
            catch (error) {
                this.logger.error(`Failed to publish: ${event.eventType} — ${error.message}`);
                await this.eventOutboxService.markFailed(event._id.toString(), error.message);
            }
        });
        this.changeStream.on('error', (error) => {
            this.logger.error(`Change Stream error: ${error.message}`);
        });
    }
};
exports.EventOutboxProcessor = EventOutboxProcessor;
exports.EventOutboxProcessor = EventOutboxProcessor = EventOutboxProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_outbox_service_1.EventOutboxService,
        nestjs_rabbitmq_1.AmqpConnection])
], EventOutboxProcessor);
//# sourceMappingURL=event-outbox-processor.js.map