import { MessageHandlerErrorBehavior, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BookingConsumer } from "./rabbitmq-booking-processor";
import { TicketModule } from "src/modules/ticket/ticket.module";


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
   providers: [BookingConsumer]
})

export class CustomRabbitMQModule { }