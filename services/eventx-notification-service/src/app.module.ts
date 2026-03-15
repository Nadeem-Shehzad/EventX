import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validationSchema } from "./config/validation.schema";
import appConfig from "./config/config.app";
import mailConfig from "./config/mail.config";
import { MailModule } from "./mail/mail.module";
import { EmailQueueModule } from "./queue/email.queue.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CircuitBreakerService } from "./circuit-breaker/circuit-breaker.service";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         load: [appConfig, mailConfig],
         validationSchema,
      }),
      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('NOTIFICATION_MONGO_URI'),
         }),
      }),
      EmailQueueModule,
      MailModule,
   ],

   providers: [
      //CircuitBreakerService
   ]
})

export class AppModule { }