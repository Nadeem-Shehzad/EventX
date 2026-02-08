import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QUEUES } from "../constants/queues";
import { EmailProcessor } from "./email.processor";
import { MailModule } from "src/mail/mail.module";
import { ConfigService } from "@nestjs/config";


@Module({
   imports: [
      
      BullModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            connection: {
               host: config.get('REDIS_HOST'),
               port: config.get('REDIS_PORT'),
            },
         }),
      }),

      BullModule.registerQueue({
         name: QUEUES.EMAIL,
         defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5000 },
         },
      }),

      MailModule
   ],
   providers: [EmailProcessor]
})

export class EmailQueueModule { }