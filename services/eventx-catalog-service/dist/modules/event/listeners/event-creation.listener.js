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
var TicketConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketConsumer = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const event_service_1 = require("../event.service");
let TicketConsumer = TicketConsumer_1 = class TicketConsumer {
    eventService;
    logger = new common_1.Logger(TicketConsumer_1.name);
    constructor(eventService) {
        this.eventService = eventService;
    }
    async handleCompensation(msg) {
        const { eventId, reason } = msg;
        console.log(`🔥 COMPENSATION HANDLER CALLED Event ID --> ${eventId}`);
        try {
            await this.eventService.deleteEventById(eventId);
            this.logger.log(`Ticket-Compensation  Event-Deleted Successfully.`);
        }
        catch (error) {
            this.logger.log(`Ticket-Compensation  Error in event-deletion --> ${error.message}`);
        }
    }
};
exports.TicketConsumer = TicketConsumer;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: 'eventx.events',
        routingKey: 'event.creation.compensate',
        queue: 'ticket.creation.failed',
        queueOptions: { durable: true },
        allowNonJsonMessages: true,
        errorHandler: (channel, msg, error) => {
            console.log('🔥 ERROR IN SUBSCRIBER:', error);
            console.log('🔥 RAW MESSAGE:', msg.content.toString());
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketConsumer.prototype, "handleCompensation", null);
exports.TicketConsumer = TicketConsumer = TicketConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_service_1.EventService])
], TicketConsumer);
//# sourceMappingURL=event-creation.listener.js.map