import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../queue.constants';
import { EventImageProcessor } from './image.processor';


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] :
   [
      BullModule.registerQueue({
         name: QUEUES.EVENT_IMAGE,
      }),
   ],
   providers: isTest ? [] : [EventImageProcessor],
   exports: isTest ? [] : [BullModule],
})
export class ImageQueueModule { }