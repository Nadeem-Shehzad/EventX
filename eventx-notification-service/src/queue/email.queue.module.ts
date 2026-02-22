import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";
import { EmailConsumer } from './email.subscriber';
import { MailModule } from "../mail/mail.module";

@Module({
   imports: [
      RabbitMQModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>("RABBITMQ_URI"),
            exchanges: [
               {
                  name: "eventx.events",
                  type: "topic",
               },
            ],
            connectionInitOptions: { wait: true },
         }),
      }),
      MailModule,
   ],
   providers: [EmailConsumer],
})

export class EmailQueueModule { }