import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { PaymentSagaService } from "./payment-saga.service";
import { Logger } from "@nestjs/common";


@Processor(QUEUES.PAYMENT_QUEUE)
export class PaymentSagaProcessor extends WorkerHost {

   private readonly logger = new Logger(PaymentSagaProcessor.name);
   constructor(private readonly sagaService: PaymentSagaService) { super() }

   async process(job: Job) {
      this.logger.warn('Inside Ticket-Module-SAGA');
      return this.sagaService.handle(job);
   }
}