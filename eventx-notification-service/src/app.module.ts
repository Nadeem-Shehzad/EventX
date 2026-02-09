import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./config/validation.schema";
import appConfig from "./config/config.app";
import redisConfig from './config/config.redis'
import { MailModule } from "./mail/mail.module";
import { EmailQueueModule } from "./queue/email.queue.module";
import mailConfig from './config/mail.config'


@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         load: [
            appConfig,
            redisConfig,
            mailConfig
         ],
         validationSchema
      }),
      EmailQueueModule,
      MailModule
   ],
})

export class AppModule { }