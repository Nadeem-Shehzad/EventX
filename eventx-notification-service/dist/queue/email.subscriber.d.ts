import { Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MailService } from "../mail/mail.service";
import type { ConsumeMessage } from 'amqplib';
import { IdempotencyService } from "../idempotency/idempotency.service";
export declare class EmailConsumer {
    private readonly mailService;
    private readonly amqpConnection;
    private readonly idempotencyService;
    private readonly logger;
    constructor(mailService: MailService, amqpConnection: AmqpConnection, idempotencyService: IdempotencyService);
    handleBookingConfirmed(msg: any, amqpMsg: ConsumeMessage): Promise<Nack | undefined>;
    handleBookingFailed(msg: any): Promise<void>;
}
