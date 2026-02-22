import { Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MailService } from "../mail/mail.service";
import type { ConsumeMessage } from 'amqplib';
export declare class EmailConsumer {
    private readonly mailService;
    private readonly amqpConnection;
    private readonly logger;
    constructor(mailService: MailService, amqpConnection: AmqpConnection);
    handleBookingConfirmed(msg: any, amqpMsg: ConsumeMessage): Promise<Nack | undefined>;
    handleBookingFailed(msg: any): Promise<void>;
}
