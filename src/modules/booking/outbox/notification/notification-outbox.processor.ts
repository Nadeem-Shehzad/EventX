import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { NotificationOutboxService } from "./notification-outbox.service";


@Injectable()
export class NotificationOutboxProcessor implements OnModuleInit, OnModuleDestroy {

   private readonly logger = new Logger(NotificationOutboxProcessor.name);
   private changeStream: any;

   constructor(
      private readonly notificationOutboxService: NotificationOutboxService,
      private readonly amqpConnection: AmqpConnection,
   ) { }

   
   async onModuleInit() {
      await this.startChangeStream();
   }

   async onModuleDestroy() {
      if (this.changeStream) {
         await this.changeStream.close();
         this.logger.log('Change Stream closed');
      }
   }

   private async startChangeStream() {
      
      const model = this.notificationOutboxService.getModel();

      // watch only INSERT operations on outbox collection
      this.changeStream = model.watch(
         [{ $match: { operationType: 'insert' } }],
         { fullDocument: 'updateLookup' }
      );

      this.logger.log('📡 Notification Outbox Change Stream started');

      this.changeStream.on('change', async (change: any) => {
         const event = change.fullDocument;

         this.logger.log(`⚡ New outbox event detected: ${event.eventType} for ${event.aggregateId}`);

         try {
            await this.amqpConnection.publish(
               'eventx.events',
               event.eventType,        // routing key e.g. 'booking.confirmed'
               event.payload,
               {
                  messageId: `${event.eventType}.${event.aggregateId}`, // idempotency key for consumer
                  persistent: true,
               }
            );

            await this.notificationOutboxService.markPublished(event._id.toString());
            this.logger.log(`✅ Published: ${event.eventType} for ${event.aggregateId}`);

         } catch (error) {
            this.logger.error(`❌ Failed to publish: ${event.eventType} — ${error.message}`);
            await this.notificationOutboxService.markFailed(event._id.toString(), error.message);
            // entry stays in DB with FAILED status
            // you can add a fallback cron later to retry FAILED entries
         }
      });

      this.changeStream.on('error', (error: any) => {
         this.logger.error(`Change Stream error: ${error.message}`);
      });
   }
}