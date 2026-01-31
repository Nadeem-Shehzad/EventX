import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EmailQueueModule } from "./email/email.queue.module";
import { ImageQueueModule } from "./event-image/image.queue.module";
import { EventQueueModule } from "./event/event.queue.module";


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] :
   [
      BullModule.forRoot({
         connection: {
            host: 'localhost',
            port: 6379
         }
      }),

      ImageQueueModule,
      EmailQueueModule,
      EventQueueModule
   ],
   exports: isTest ? []: [BullModule]
})

export class QueuesModule { }