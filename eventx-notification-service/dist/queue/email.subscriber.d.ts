import { Nack } from "@golevelup/nestjs-rabbitmq";
import { MailService } from "../mail/mail.service";
export declare class EmailConsumer {
    private readonly mailService;
    private readonly logger;
    constructor(mailService: MailService);
    handleBookingConfirmed(msg: any): Promise<Nack | undefined>;
}
