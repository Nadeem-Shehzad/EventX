import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { PaymentSagaService } from "./payment-saga.service";
import { Logger } from "@nestjs/common";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { OutboxService } from "src/outbox/outbox.service";


@Processor(QUEUES.PAYMENT_QUEUE)
export class PaymentSagaProcessor extends WorkerHost {

   private readonly logger = new Logger(PaymentSagaProcessor.name);

   constructor(
      private readonly sagaService: PaymentSagaService,
      private readonly outboxService: OutboxService
   ) { super() }


   async process(job: Job) {
      this.logger.warn('Inside Payment-Module-SAGA');
      return this.sagaService.handle(job);
   }


   @OnWorkerEvent('failed')
   async onFailed(job: Job, err: Error) {

      const maxAttempts = job.opts.attempts || 1;

      // Check if we have attempts remaining
      if (job.attemptsMade < maxAttempts) {
         this.logger.warn(`Job ${job.id} failed (Attempt ${job.attemptsMade} of ${maxAttempts}). Retrying...`);
         return;
      }

      this.logger.error(`Job ${job.id} failed permanently. Triggering Saga Rollback.`);

      const failureEvent = this.failureMap[job.name];
      if (!failureEvent) return;

      await this.emit(failureEvent, job.data.bookingId, {
         bookingId: job.data.bookingId,
         reason: err.message,
      });
   }


   private readonly failureMap = {
      [DOMAIN_EVENTS.PAYMENT_REQUEST]: DOMAIN_EVENTS.PAYMENT_FAILED,
   };

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.PAYMENT, aggregateId, event, payload);
   }
}