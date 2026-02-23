import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import type { ConsumeMessage } from 'amqplib';
import { IdempotencyService } from "../idempotency/idempotency.service";


const MAX_RETRIES = 3;


@Injectable()
export class EmailConsumer {

   private readonly logger = new Logger(EmailConsumer.name);

   constructor(
      private readonly mailService: MailService,
      private readonly amqpConnection: AmqpConnection,
      private readonly idempotencyService: IdempotencyService,
   ) { }


   @RabbitSubscribe({
      exchange: "eventx.events",
      routingKey: "booking.confirmed",
      queue: "notification.booking.confirmed",
      queueOptions: { durable: true },
   })
   async handleBookingConfirmed(msg: any, amqpMsg: ConsumeMessage) {

      this.logger.log("+++++ INSIDE MICROSERVICE - NOTIFICATION +++++");

      const retryCount = amqpMsg.properties.headers?.['x-retry-count'] ?? 0;

      const messageId = amqpMsg.properties.messageId ?? `booking.confirmed.${msg.bookingId}`;

      const isFirstTime = await this.idempotencyService.tryMarkAsProcessing(
         messageId,
         { bookingId: msg.bookingId, email: msg.email }
      );

      if (!isFirstTime) {
         this.logger.warn(`Duplicate message: ${messageId} — skipping`);
         return; // auto ack, skip
      }

      this.logger.log(`📥 Attempt ${retryCount + 1}/${MAX_RETRIES + 1} for booking: ${msg.bookingId}`);

      try {
         await this.mailService.sendBookingSuccess(msg);
         //throw new Error('DB is down!');
         this.logger.log(`Email sent successfully for booking: ${msg.bookingId}`);

      } catch (error) {
         this.logger.error(`Failed attempt ${retryCount + 1}: ${error.message}`);

         await this.idempotencyService.deleteRecord(messageId);

         if (retryCount < MAX_RETRIES) {
            this.logger.log(`Retry ${retryCount + 1}/${MAX_RETRIES}...`);

            await this.amqpConnection.publish(
               'eventx.events',
               'notification.booking.confirmed.retry',
               msg,
               {
                  headers: {
                     'x-retry-count': retryCount + 1
                  }
               }
            );

            return new Nack(false);
         }

         // max retries reached → send to DLQ
         this.logger.error(`Max retries reached. Sending to DLQ for booking: ${msg.bookingId}`);

         await this.amqpConnection.publish(
            'eventx.dlx',
            'notification.booking.confirmed.failed',
            {
               ...msg,
               failureReason: error.message,
               failedAt: new Date().toISOString(),
               totalAttempts: retryCount + 1,
            }
         );

         return new Nack(false);
      }
   }


   @RabbitSubscribe({
      exchange: 'eventx.dlx',
      routingKey: 'notification.booking.confirmed.failed',
      queue: 'notification.booking.confirmed.failed',
      queueOptions: { durable: true }
   })
   async handleBookingFailed(msg: any) {
      this.logger.error(`----- INSIDE DLQ -----`);
      this.logger.error(`--- ALERT DEVELOPER ---`);
   }
}