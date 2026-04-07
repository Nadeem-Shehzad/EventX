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
var EmailConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConsumer = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail/mail.service");
const idempotency_service_1 = require("../idempotency/idempotency.service");
const circuit_breaker_service_1 = require("../circuit-breaker/circuit-breaker.service");
const MAX_RETRIES = 3;
let EmailConsumer = EmailConsumer_1 = class EmailConsumer {
    mailService;
    amqpConnection;
    idempotencyService;
    circuitBreakerService;
    logger = new common_1.Logger(EmailConsumer_1.name);
    breaker;
    constructor(mailService, amqpConnection, idempotencyService, circuitBreakerService) {
        this.mailService = mailService;
        this.amqpConnection = amqpConnection;
        this.idempotencyService = idempotencyService;
        this.circuitBreakerService = circuitBreakerService;
        this.breaker = this.circuitBreakerService.create('send-booking-email', this.processWithRetry.bind(this));
    }
    async processWithRetry(msg, retryCount, messageId) {
        try {
            await this.mailService.sendBookingSuccess(msg);
            this.logger.log(`✅ Email sent for booking: ${msg.bookingId}`);
        }
        catch (error) {
            this.logger.error(`Failed attempt ${retryCount + 1}: ${error.message}`);
            await this.idempotencyService.deleteRecord(messageId);
            throw error;
        }
    }
    async handleBookingConfirmed(msg, amqpMsg) {
        this.logger.log("+++++ INSIDE MICROSERVICE - NOTIFICATION +++++");
        const retryCount = amqpMsg.properties.headers?.['x-retry-count'] ?? 0;
        const messageId = amqpMsg.properties.messageId ?? `booking.confirmed.${msg.bookingId}`;
        const isFirstTime = await this.idempotencyService.tryMarkAsProcessing(messageId, { bookingId: msg.bookingId, email: msg.email });
        if (!isFirstTime) {
            this.logger.warn(`Duplicate message: ${messageId} — skipping`);
            return;
        }
        this.logger.log(`📥 Attempt ${retryCount + 1}/${MAX_RETRIES + 1} for booking: ${msg.bookingId}`);
        try {
            await this.breaker.fire(msg, retryCount, messageId);
        }
        catch (error) {
            if (this.breaker.opened) {
                this.logger.error(`🚫 Circuit OPEN — going straight to DLQ, no retries`);
                await this.sendToDLQ(msg, error.message, retryCount);
                return new nestjs_rabbitmq_1.Nack(false);
            }
            if (retryCount < MAX_RETRIES) {
                this.logger.log(`Retry ${retryCount + 1}/${MAX_RETRIES}...`);
                await this.amqpConnection.publish('eventx.events', 'notification.booking.confirmed.retry', msg, { headers: { 'x-retry-count': retryCount + 1 } });
                return new nestjs_rabbitmq_1.Nack(false);
            }
            this.logger.error(`Max retries reached. Sending to DLQ for booking: ${msg.bookingId}`);
            await this.sendToDLQ(msg, error.message, retryCount);
            return new nestjs_rabbitmq_1.Nack(false);
        }
    }
    async sendToDLQ(msg, reason, totalAttempts) {
        await this.amqpConnection.publish('eventx.dlx', 'notification.booking.confirmed.failed', {
            ...msg,
            failureReason: reason,
            failedAt: new Date().toISOString(),
            totalAttempts: totalAttempts + 1,
        });
    }
    async handleBookingFailed(msg) {
        this.logger.error(`----- INSIDE DLQ -----`);
        this.logger.error(`--- ALERT DEVELOPER ---`);
    }
};
exports.EmailConsumer = EmailConsumer;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: "eventx.events",
        routingKey: "booking.confirmed",
        queue: "notification.booking.confirmed",
        queueOptions: { durable: true },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailConsumer.prototype, "handleBookingConfirmed", null);
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: 'eventx.dlx',
        routingKey: 'notification.booking.confirmed.failed',
        queue: 'notification.booking.confirmed.failed',
        queueOptions: { durable: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailConsumer.prototype, "handleBookingFailed", null);
exports.EmailConsumer = EmailConsumer = EmailConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        nestjs_rabbitmq_1.AmqpConnection,
        idempotency_service_1.IdempotencyService,
        circuit_breaker_service_1.CircuitBreakerService])
], EmailConsumer);
//# sourceMappingURL=email.subscriber.js.map