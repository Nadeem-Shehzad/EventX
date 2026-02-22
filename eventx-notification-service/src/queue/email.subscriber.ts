import { RabbitSubscribe, Nack } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { MailService } from "../mail/mail.service";

@Injectable()
export class EmailConsumer {
   private readonly logger = new Logger(EmailConsumer.name);

   constructor(private readonly mailService: MailService) { }

   @RabbitSubscribe({
      exchange: "eventx.events",
      routingKey: "booking.confirmed",
      queue: "notification.booking.confirmed",
      queueOptions: {
         deadLetterExchange: "eventx.events",
         deadLetterRoutingKey: "booking.confirmed.retry",
      },
   })
   async handleBookingConfirmed(msg: any) {
      try {
         this.logger.log("+++++ INSIDE MICROSERVICE - NOTIFICATION +++++");
         await this.mailService.sendBookingSuccess(msg);
      } catch (error) {
         this.logger.error("EmailConsumer failed:", error);
         return new Nack(false); // false = don't requeue directly, let DLX handle retry
      }
   }
}