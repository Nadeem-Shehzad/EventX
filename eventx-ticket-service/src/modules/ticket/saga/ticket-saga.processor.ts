import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { TicketSagaService } from "./ticket-saga.service";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";


@Processor(QUEUES.TICKET_QUEUE)
@Injectable()
export class TicketSagaProcessor extends WorkerHost {

   constructor(
      private readonly sagaService: TicketSagaService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { super() }


   async process(job: Job) {

      this.logger.info({
         module: 'Ticket',
         service: TicketSagaProcessor.name,
         msg: 'Inside Ticket-Module-SAGA',
      });

      return this.sagaService.handle(job);
   }


   @OnWorkerEvent('failed')
   async onFailed(job: Job, err: Error) {

      const maxAttempts = job.opts.attempts || 1;

      if (job.attemptsMade < maxAttempts) {

         this.logger.warn({
            module: 'Ticket',
            service: TicketSagaProcessor.name,
            msg: `Job ${job.id} failed (Attempt ${job.attemptsMade} of ${maxAttempts}). Retrying...`,
         });
         
         return;
      }

      this.logger.error({
         module: 'Ticket',
         service: TicketSagaProcessor.name,
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
      [DOMAIN_EVENTS.BOOKING_CREATED]: DOMAIN_EVENTS.TICKETS_FAILED,
   };

   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.TICKET, aggregateId, event, payload);
   }
}