import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { BookingSagaService } from "./booking-saga.service";


@Processor(QUEUES.BOOKING_QUEUE)
@Injectable()
export class BookingSagaProcessor extends WorkerHost {

   private readonly logger = new Logger(BookingSagaProcessor.name);

   constructor(private readonly sagaService: BookingSagaService,) { super() }

   async process(job: Job) {
      this.logger.warn('Inside Booking-Module-SAGA');
      return this.sagaService.handle(job);
   }
}