import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import type { ConsumeMessage } from 'amqplib';
import { IdempotencyService } from "../idempotency/idempotency.service";
import CircuitBreaker from 'opossum';
import { CircuitBreakerService } from "src/circuit-breaker/circuit-breaker.service";

const MAX_RETRIES = 3;

@Injectable()
export class EmailConsumer {

   private readonly logger = new Logger(EmailConsumer.name);
   private readonly breaker: CircuitBreaker;

   constructor(
      private readonly mailService: MailService,
      private readonly amqpConnection: AmqpConnection,
      private readonly idempotencyService: IdempotencyService,
      private readonly circuitBreakerService: CircuitBreakerService,
   ) {
      this.breaker = this.circuitBreakerService.create(
         'sendgrid-booking-email',
         this.processWithRetry.bind(this),
      );
   }

   // ✅ only responsible for ONE attempt — always throws on failure, never returns Nack
   private async processWithRetry(msg: any, retryCount: number, messageId: string) {
      try {
         await this.mailService.sendBookingSuccess(msg);
         //throw new Error('DB is down!'); // for testing
         this.logger.log(`✅ Email sent for booking: ${msg.bookingId}`);

      } catch (error) {
         this.logger.error(`Failed attempt ${retryCount + 1}: ${error.message}`);

         // delete record so next retry passes idempotency check
         await this.idempotencyService.deleteRecord(messageId);

         throw error; // 👈 always throw — opossum must know this failed
      }
   }

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
         return;
      }

      this.logger.log(`📥 Attempt ${retryCount + 1}/${MAX_RETRIES + 1} for booking: ${msg.bookingId}`);

      try {
         await this.breaker.fire(msg, retryCount, messageId);

      } catch (error) {

         // circuit is OPEN — fail fast, skip retries entirely
         if (this.breaker.opened) {
            this.logger.error(`🚫 Circuit OPEN — going straight to DLQ, no retries`);
            await this.sendToDLQ(msg, error.message, retryCount);
            return new Nack(false);
         }

         // circuit is CLOSED but this attempt failed — retry if possible
         if (retryCount < MAX_RETRIES) {
            this.logger.log(`Retry ${retryCount + 1}/${MAX_RETRIES}...`);
            await this.amqpConnection.publish(
               'eventx.events',
               'notification.booking.confirmed.retry',
               msg,
               { headers: { 'x-retry-count': retryCount + 1 } }
            );
            return new Nack(false);
         }

         // max retries exhausted → DLQ
         this.logger.error(`Max retries reached. Sending to DLQ for booking: ${msg.bookingId}`);
         await this.sendToDLQ(msg, error.message, retryCount);
         return new Nack(false);
      }
   }

   private async sendToDLQ(msg: any, reason: string, totalAttempts: number) {
      await this.amqpConnection.publish(
         'eventx.dlx',
         'notification.booking.confirmed.failed',
         {
            ...msg,
            failureReason: reason,
            failedAt: new Date().toISOString(),
            totalAttempts: totalAttempts + 1,
         }
      );
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