// src/queue/email/email.processor.ts
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { QUEUES } from "../queue.constants";
import { Job } from "bullmq";
import { MailService } from "src/mail/mail.service";
import { Logger } from "@nestjs/common";
import { EmailJob } from "src/constants/email-queue.constants";


@Processor(QUEUES.EMAIL)
export class EmailProcessor extends WorkerHost {
   
   private readonly logger = new Logger(EmailProcessor.name);

   constructor(private readonly mailService: MailService) {
      super();
   }

   async process(job: Job) {
      this.logger.log(`Processing job: ${job.name}`);

      switch (job.name) {
         case EmailJob.BOOKING_SUCCESS:
            this.logger.log('Handling booking success email...');
            await this.mailService.sendBookingSuccess(job.data);
            break;

         case EmailJob.BOOKING_CANCEL:
            this.logger.log('Handling booking cancel email...');
            await this.mailService.sendCancelBooking(job.data);
            break;

         // case EmailJob.BOOKING_FAILED:
         //    this.logger.log('Handling booking failed email...');
         //    break;

         default:
            this.logger.warn(`Unknown job name: ${job.name}`);
      }
   }

   @OnWorkerEvent('failed')
   async onFailed(job: Job, err: Error) {
      this.logger.error(
         `[EMAIL_QUEUE_FAILED] job=${job.name} id=${job.id} Error: ${err.message}`,
      );
   }

   @OnWorkerEvent('completed')
   async onCompleted(job: Job) {
      this.logger.log(`Job ${job.id} (${job.name}) completed successfully.`);
   }
}