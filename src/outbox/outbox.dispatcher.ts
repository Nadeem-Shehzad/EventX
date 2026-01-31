import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { Cron } from "@nestjs/schedule";
import { QUEUES } from "src/queue/queue.constants";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "./outbox.service";


@Injectable()
export class OutboxDispatcher {

   constructor(
      private readonly outboxService: OutboxService,
      // @InjectQueue(QUEUES.TICKET_QUEUE) private ticketQueue: Queue,
      // @InjectQueue(QUEUES.BOOKING_QUEUE) private bookingQueue: Queue,
      // @InjectQueue(QUEUES.PAYMENT_QUEUE) private paymentQueue: Queue
   ) { }


   @Cron('*/1 * * * * *')
   async dispatch() {

      const events = await this.outboxService.findPending();

      for (const event of events) {

         const { eventType, payload, _id } = event;

         if (eventType === DOMAIN_EVENTS.BOOKING_CREATED) {
            //await this.ticketQueue.add(eventType, payload, { jobId: _id.toString(), attempts: 3 });
         }

         else if (
            eventType === DOMAIN_EVENTS.TICKETS_RESERVED ||
            eventType === DOMAIN_EVENTS.TICKETS_FAILED ||
            eventType === DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED) {
            //await this.bookingQueue.add(eventType, payload, { jobId: _id.toString(), attempts: 3 });
         }

         else if (eventType === DOMAIN_EVENTS.PAYMENT_REQUEST) {
            //await this.paymentQueue.add(eventType, payload, { jobId: _id.toString(), attempts: 3 });
         }

         await this.outboxService.markDispatched(event._id.toString());
      }
   }
}