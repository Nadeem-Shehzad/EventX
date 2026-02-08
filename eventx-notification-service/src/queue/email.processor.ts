import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailJob } from "../constants/job";
import { MailService } from "../mail/mail.service";
import { QUEUES } from '../constants/queues'


@Processor(QUEUES.EMAIL)
export class EmailProcessor extends WorkerHost {

   constructor(private readonly mailService: MailService) {
      super();
   }

   async process(job: Job) {
      try {
         console.log('+++++ INSIDE MICROSERVICE - NOTIFICATION +++++');
         switch (job.name) {
            case EmailJob.BOOKING_SUCCESS:
               await this.mailService.sendBookingSuccess(job.data);
               break;


         }
      } catch (error) {
         // log error
         console.error('EmailProcessor failed:', error);
         throw error; // so BullMQ can retry
      }
   }
}