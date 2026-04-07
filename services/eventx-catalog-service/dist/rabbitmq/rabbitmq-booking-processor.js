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
var BookingConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingConsumer = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const ticket_service_1 = require("../modules/ticket/ticket.service");
let BookingConsumer = BookingConsumer_1 = class BookingConsumer {
    ticketService;
    amqpConnection;
    logger = new common_1.Logger(BookingConsumer_1.name);
    constructor(ticketService, amqpConnection) {
        this.ticketService = ticketService;
        this.amqpConnection = amqpConnection;
    }
    async handleBookingCreated(eventData, amqpMsg) {
        this.logger.log("+++++ INSIDE MICROSERVICE --- TICKET-CREATION +++++");
        console.log('Ticket-Data --> ', eventData.ticketTypes);
        try {
            this.logger.log(`Tickets Created successfully for Event`);
        }
        catch (error) {
            this.logger.error(`Ticket Creation Failed --- ${error.message}`);
            await this.amqpConnection.publish('eventx.events', 'event.creation.compensate', {
                eventId: eventData.eventId,
                reason: error.message
            }, {
                persistent: true
            });
            this.logger.warn(`Compensation Send Back`);
        }
    }
};
exports.BookingConsumer = BookingConsumer;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: 'eventx.events',
        routingKey: 'event.created',
        queue: 'ticket.creation',
        queueOptions: { durable: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingConsumer.prototype, "handleBookingCreated", null);
exports.BookingConsumer = BookingConsumer = BookingConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_service_1.TicketService,
        nestjs_rabbitmq_1.AmqpConnection])
], BookingConsumer);
//# sourceMappingURL=rabbitmq-booking-processor.js.map