import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { EventOutboxService } from "./event-outbox.service";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";


@Injectable()
export class EventOutoxProcessor implements OnModuleInit, OnModuleDestroy {

   private readonly logger = new Logger(EventOutoxProcessor.name);
   private changeStream: any;

   constructor(
      private readonly eventOutboxService: EventOutboxService,
      private readonly amqpConnection: AmqpConnection
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

      const model = this.eventOutboxService.getModel();

      this.changeStream = model.watch(
         [{ $match: { operationType: 'insert' } }],
         { fullDocument: 'updateLookup' }
      );

      this.logger.log('Event Outbox Change Stream started');

      this.changeStream.on('change', async (change: any) => {

         const event = change.fullDocument;

         this.logger.log(`New outbox event detected: ${event.eventType} for ${event.aggregateId}`);

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

            await this.eventOutboxService.markPublished(event._id.toString());
            this.logger.log(`Published: ${event.eventType} for ${event.aggregateId}`);

         } catch (error) {
            this.logger.error(`Failed to publish: ${event.eventType} — ${error.message}`);
            await this.eventOutboxService.markFailed(event._id.toString(), error.message);
         }

      });

      this.changeStream.on('error', (error: any) => {
         this.logger.error(`Change Stream error: ${error.message}`);
      });
   }
}