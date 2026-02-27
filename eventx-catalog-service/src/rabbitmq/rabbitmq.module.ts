import { MessageHandlerErrorBehavior, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BookingConsumer } from "./rabbitmq-booking-processor";
import { TicketModule } from "src/modules/ticket/ticket.module";


@Global()
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
            defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
            channels: {
               'channel-main': {
                  prefetchCount: 1,
                  default: true,
               },
            },
         }),
      }),

      TicketModule
   ],
   providers: [BookingConsumer],
   exports: [RabbitMQModule]
})

export class CustomRabbitMQModule { }