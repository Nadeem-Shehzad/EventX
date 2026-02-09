import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../queue.constants';


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] : [
      BullModule.registerQueue({
         name: QUEUES.EMAIL,
      }),
   ],
   exports: isTest ? [] : [BullModule],
})

export class EmailQueueModule { }