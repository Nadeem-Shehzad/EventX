import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./config/validation.schema";
import appConfig from "./config/config.app";
import mailConfig from "./config/mail.config";
import { MailModule } from "./mail/mail.module";
import { EmailQueueModule } from "./queue/email.queue.module";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         load: [appConfig, mailConfig],
         validationSchema,
      }),
      EmailQueueModule,
      MailModule,
   ],
})

export class AppModule { }