import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "./outbox.service";


@Injectable()
export class OutboxDispatcher {

   private isProcessing = false;
   private changeStream: any;
   private readonly logger = new Logger(OutboxDispatcher.name);

   constructor(
      private readonly outboxService: OutboxService,
      @InjectQueue(QUEUES.TICKET_QUEUE) private ticketQueue: Queue,
      @InjectQueue(QUEUES.BOOKING_QUEUE) private bookingQueue: Queue,
      @InjectQueue(QUEUES.PAYMENT_QUEUE) private paymentQueue: Queue
   ) { }

   async onModuleInit() {
      await this.startChangeStream();
   }

   async onModuleDestroy() {
      if (this.changeStream) {
         await this.changeStream.close();
         this.logger.log('OutboxDispatcher Change Stream closed');
      }
   }

   private async startChangeStream() {
      const model = this.outboxService.getModel();

      this.changeStream = model.watch(
         [{ $match: { operationType: 'insert' } }],
         { fullDocument: 'updateLookup' }
      );

      this.logger.log('OutboxDispatcher Change Stream started');

      this.changeStream.on('change', async (change: any) => {
         const event = change.fullDocument;
         this.logger.log(`New outbox event detected: ${event.eventType}`);
         await this.processEvent(event);
      });

      this.changeStream.on('error', (error: any) => {
         this.logger.error(`Change Stream error: ${error.message}`);
      });
   }


   private async processEvent(event: any) {
      const { eventType, payload, _id } = event;

      await this.outboxService.markDispatched(event._id.toString());

      if (
         eventType === DOMAIN_EVENTS.BOOKING_CREATED ||
         eventType === DOMAIN_EVENTS.TICKETS_SOLD
      ) {
         await this.ticketQueue.add(eventType, payload, this.jobOptions(_id.toString()));
      }

      else if (
         eventType === DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED ||
         eventType === DOMAIN_EVENTS.BOOKING_CONFIRMED ||
         eventType === DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED ||
         eventType === DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED
      ) {
         await this.bookingQueue.add(eventType, payload, this.jobOptions(_id.toString()));
      }

      else if (
         eventType === DOMAIN_EVENTS.PAYMENT_REQUEST ||
         eventType === DOMAIN_EVENTS.PAYMENT_FAILED ||
         eventType === DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST
      ) {
         await this.paymentQueue.add(eventType, payload, this.jobOptions(_id.toString()));
      }
   }


   private jobOptions(id: string) {
      return {
         jobId: id,
         attempts: 3,
         backoff: { type: 'exponential', delay: 2000 },
         removeOnComplete: true,
         removeOnFail: false,
      };
   }

}