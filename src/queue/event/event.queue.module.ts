import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QUEUES } from "../queue.constants";

const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] :
      [
         BullModule.registerQueue({
            name: QUEUES.TICKET_QUEUE,
         }),

         BullModule.registerQueue({
            name: QUEUES.BOOKING_QUEUE,
         }),
      ],
   // providers: isTest ? [] : [BookingProcessor],
   exports: isTest ? [] : [BullModule],
})

export class EventQueueModule { }