import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MailService } from "../mail/mail.service";
export declare class EmailProcessor extends WorkerHost {
    private readonly mailService;
    constructor(mailService: MailService);
    process(job: Job): Promise<void>;
}
