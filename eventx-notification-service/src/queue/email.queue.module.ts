import { Module } from "@nestjs/common";
import { MessageHandlerErrorBehavior, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";
import { EmailConsumer } from './email.subscriber';
import { MailModule } from "../mail/mail.module";
import { IdempotencyModule } from "../idempotency/idempotency.module";


@Module({
   imports: [
      RabbitMQModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>("RABBITMQ_URI")!,
            exchanges: [
               {
                  name: "eventx.events",
                  type: "topic",
               },
            ],
            connectionInitOptions: { wait: true },
            defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK, // unhandled exceptions → nack
            channels: {
               'channel-main': {
                  prefetchCount: 1,  
                  default: true,     
               },
            },
         }),
      }),
      IdempotencyModule,
      MailModule,
   ],
   providers: [EmailConsumer],
})

export class EmailQueueModule { }