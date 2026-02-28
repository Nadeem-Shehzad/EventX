import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";
import { NotificationOutbox, NotificationOutboxSchema } from "./notification-outbox.schema";
import { NotificationOutboxRepo } from "./notification-outbox.repo";
import { NotificationOutboxProcessor } from "./notification-outbox.processor";
import { NotificationOutboxService } from "./notification-outbox.service";


@Module({
   imports: [
      MongooseModule.forFeature([{
         name: NotificationOutbox.name,
         schema: NotificationOutboxSchema
      }]),
   ],
   providers: [
      NotificationOutboxRepo,
      NotificationOutboxService,
      NotificationOutboxProcessor,
   ],
   exports: [NotificationOutboxService]
})

export class NotificationOutboxModule { }