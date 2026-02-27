import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EventQueueModule } from "./event/event.queue.module";
import { ImageQueueModule } from "./event-image/image.queue.module";


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] :
   [
      BullModule.forRoot({
         connection: {
            host: 'localhost', // localhost if runs on host machine
            port: 6379
         }
      }),

      ImageQueueModule,
      EventQueueModule
   ],
   exports: isTest ? []: [BullModule]
})

export class QueuesModule { }