import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { Cron } from "@nestjs/schedule";
import { QUEUES } from "src/queue/queue.constants";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "./outbox.service";


@Injectable()
export class OutboxDispatcher {

   private isProcessing = false;

   constructor(
      private readonly outboxService: OutboxService,
      // @InjectQueue(QUEUES.TICKET_QUEUE) private ticketQueue: Queue,
      // @InjectQueue(QUEUES.BOOKING_QUEUE) private bookingQueue: Queue,
      // @InjectQueue(QUEUES.PAYMENT_QUEUE) private paymentQueue: Queue
   ) { }


   @Cron('*/1 * * * * *')
   async dispatch() {

      if (this.isProcessing) return;

      this.isProcessing = true;

      try {
         const events = await this.outboxService.findPending();

         for (const event of events) {
            await this.processEvent(event);
         }

      } catch (e) {
         console.error(e);

      } finally {
         this.isProcessing = false;
      }
   }


   private async processEvent(event) {
      const { eventType, payload, _id } = event;

      await this.outboxService.markDispatched(event._id.toString());

      if (eventType === DOMAIN_EVENTS.BOOKING_CREATED) {
         //await this.ticketQueue.add(eventType, payload, this.jobOptions(_id.toString()));
      }

      else if (
         eventType === DOMAIN_EVENTS.TICKETS_RESERVED ||
         eventType === DOMAIN_EVENTS.TICKETS_FAILED ||
         eventType === DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED ||
         eventType === DOMAIN_EVENTS.BOOKING_CONFIRMED ||
         eventType === DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED ||
         eventType === DOMAIN_EVENTS.BOOKING_PAYMENT_REFUNDED
      ) {
         //await this.bookingQueue.add(eventType, payload, this.jobOptions(_id.toString()));
      }

      else if (
         eventType === DOMAIN_EVENTS.PAYMENT_REQUEST ||
         eventType === DOMAIN_EVENTS.PAYMENT_FAILED ||
         eventType === DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST
      ) {
        // await this.paymentQueue.add(eventType, payload, this.jobOptions(_id.toString()));
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


   // @Cron('*/1 * * * * *')
   // async dispatch() {

   //    // if (this.isProcessing) return; // Skip if previous run is still active
   //    // this.isProcessing = true;

   //    const events = await this.outboxService.findPending();

   //    for (const event of events) {

   //       const { eventType, payload, _id } = event;

   //       try {

   //          await this.outboxService.markDispatched(event._id.toString());

   //          if (eventType === DOMAIN_EVENTS.BOOKING_CREATED) {
   //             await this.ticketQueue.add(eventType, payload, this.jobOptions(_id.toString()));
   //          }

   //          else if (
   //             eventType === DOMAIN_EVENTS.TICKETS_RESERVED ||
   //             eventType === DOMAIN_EVENTS.TICKETS_FAILED ||
   //             eventType === DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED ||
   //             eventType === DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED
   //          ) {
   //             await this.bookingQueue.add(eventType, payload, this.jobOptions(_id.toString()));
   //          }

   //          else if (
   //             eventType === DOMAIN_EVENTS.PAYMENT_REQUEST ||
   //             eventType === DOMAIN_EVENTS.PAYMENT_FAILED
   //          ) {
   //             await this.paymentQueue.add(eventType, payload, this.jobOptions(_id.toString()));
   //          }

   //       } catch (error) {
   //          throw error; // let retry by cron
   //       } finally {
   //          // this.isProcessing = false;
   //       }
   //    }
   // }
}