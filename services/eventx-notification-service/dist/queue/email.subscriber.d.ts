import { Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MailService } from "../mail/mail.service";
import type { ConsumeMessage } from 'amqplib';
import { IdempotencyService } from "../idempotency/idempotency.service";
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";
export declare class EmailConsumer {
    private readonly mailService;
    private readonly amqpConnection;
    private readonly idempotencyService;
    private readonly circuitBreakerService;
    private readonly logger;
    private readonly breaker;
    constructor(mailService: MailService, amqpConnection: AmqpConnection, idempotencyService: IdempotencyService, circuitBreakerService: CircuitBreakerService);
    private processWithRetry;
    handleBookingConfirmed(msg: any, amqpMsg: ConsumeMessage): Promise<Nack | undefined>;
    private sendToDLQ;
    handleBookingFailed(msg: any): Promise<void>;
}
