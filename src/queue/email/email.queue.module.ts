import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../queue.constants';
import { EmailProcessor } from './email.processor';
import { MailModule } from 'src/mail/mail.module';


const isTest = process.env.NODE_ENV === 'test';

@Module({
   imports: isTest ? [] : [
      BullModule.registerQueue({
         name: QUEUES.EMAIL,
      }),

      //MailModule
   ],
   // providers: isTest ? [] : [
   //    EmailProcessor
   // ],
   exports: isTest ? [] : [BullModule],
})

export class EmailQueueModule { }