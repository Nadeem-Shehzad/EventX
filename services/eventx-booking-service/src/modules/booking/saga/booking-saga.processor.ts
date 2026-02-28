import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { BookingSagaService } from "./booking-saga.service";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";


@Processor(QUEUES.BOOKING_QUEUE)
@Injectable()
export class BookingSagaProcessor extends WorkerHost {

   constructor(
      private readonly sagaService: BookingSagaService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { super() }


   async process(job: Job) {

      this.logger.info({
         module: 'Booking',
         service: BookingSagaProcessor.name,
         msg: 'Inside Booking-Module-SAGA',
      });

      return this.sagaService.handle(job);
   }


   @OnWorkerEvent('failed')
   async onFailed(job: Job, err: Error) {

      const maxAttempts = job.opts.attempts || 1;

      if (job.attemptsMade < maxAttempts) {

         this.logger.warn({
            module: 'Booking',
            service: BookingSagaProcessor.name,
            msg: `Job ${job.id} failed (Attempt ${job.attemptsMade} of ${maxAttempts}). Retrying...`,
         });

         return;
      }

      this.logger.error({
         module: 'Booking',
         service: BookingSagaProcessor.name,
         msg: `Job ${job.id} failed permanently. Triggering Saga Rollback.`,
      });

      const failureEvent = this.failureMap[job.name];
      if (!failureEvent) return;

      await this.emit(failureEvent, job.data.bookingId, {
         bookingId: job.data.bookingId,
         reason: err.message,
      });
   }

   private readonly failureMap = {
      //[DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED]: DOMAIN_EVENTS.BOOKING_CONFIRM_FAILED,
   };

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}