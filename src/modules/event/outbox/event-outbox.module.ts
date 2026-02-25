import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventOutbox, EventOutboxSchema } from "./event-outbox-schema";
import { EventOutboxRepo } from "./event-outbox-repo";
import { EventOutboxService } from "./event-outbox.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";
import { EventOutoxProcessor } from "./event-outbox-processor";


@Module({
   imports: [
      MongooseModule.forFeature([{
         name: EventOutbox.name,
         schema: EventOutboxSchema
      }]),

      ...(process.env.NODE_ENV === 'test'
         ? []
         : [
            RabbitMQModule.forRootAsync({
               inject: [ConfigService],
               useFactory: (config: ConfigService) => ({
                  uri: config.get<string>('RABBITMQ_URI')!,
                  exchanges: [
                     { name: 'eventx.events', type: 'topic' },
                     { name: 'eventx.dlx', type: 'topic' },
                  ],
                  connectionInitOptions: { wait: true },
               }),
            }),
         ]),
   ],
   providers: [
      EventOutboxService,
      EventOutboxRepo,
      ...(process.env.NODE_ENV === 'test'
         ? []
         : [EventOutoxProcessor]),
   ],
   exports: [EventOutboxService]
})

export class EventOutboxModule { }