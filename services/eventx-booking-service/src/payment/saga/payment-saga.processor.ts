import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { PaymentSagaService } from "./payment-saga.service";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";


@Processor(QUEUES.PAYMENT_QUEUE)
export class PaymentSagaProcessor extends WorkerHost {

   constructor(
      private readonly sagaService: PaymentSagaService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { super() }


   async process(job: Job) {
      this.logger.info({
         module: 'Payment',
         service: PaymentSagaProcessor.name,
         msg: 'Inside Payment-Module-SAGA',
      });

      return this.sagaService.handle(job);
   }


   @OnWorkerEvent('failed')
   async onFailed(job: Job, err: Error) {

      const maxAttempts = job.opts.attempts || 1;

      // Check if we have attempts remaining
      if (job.attemptsMade < maxAttempts) {

         this.logger.warn({
            module: 'Payment',
            service: PaymentSagaProcessor.name,
            msg: `Job ${job.id} failed (Attempt ${job.attemptsMade} of ${maxAttempts}). Retrying...`,
         });

         return;
      }

      this.logger.error({
         module: 'Payment',
         service: PaymentSagaProcessor.name,
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
      [DOMAIN_EVENTS.PAYMENT_REQUEST]: DOMAIN_EVENTS.PAYMENT_FAILED,
      // payment refund failed
   };

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.PAYMENT, aggregateId, event, payload);
   }
}