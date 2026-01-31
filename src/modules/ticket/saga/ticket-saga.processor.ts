import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { TicketSagaService } from "./ticket-saga.service";


@Processor(QUEUES.TICKET_QUEUE)
@Injectable()
export class TicketSagaProcessor extends WorkerHost {

   private readonly logger = new Logger(TicketSagaProcessor.name);

   constructor(
      private readonly sagaService: TicketSagaService
   ) { super() }

   async process(job: Job) {
      this.logger.warn('Inside Ticket-Module-SAGA');
      return this.sagaService.handle(job);
   }
}