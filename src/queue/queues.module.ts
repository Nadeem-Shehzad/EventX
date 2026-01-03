import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] :
   [
      BullModule.forRoot({
         connection: {
            host: 'localhost',
            port: 6379
         }
      })
   ],
   exports: isTest ? []: [BullModule]
})

export class QueuesModule { }