import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { TicketService } from '../modules/ticket/ticket.service';
import type { ConsumeMessage } from "amqplib";


@Injectable()
export class BookingConsumer {

   private readonly logger = new Logger(BookingConsumer.name);

   constructor(
      private readonly ticketService: TicketService,
      private readonly amqpConnection: AmqpConnection
   ) { }


   @RabbitSubscribe({
      exchange: 'eventx.events',
      routingKey: 'event.created',
      queue: 'ticket.creation',
      queueOptions: { durable: true }
   })
   async handleBookingCreated(eventData: any, amqpMsg: ConsumeMessage) {

      this.logger.log("+++++ INSIDE MICROSERVICE --- TICKET-CREATION +++++");
      console.log('Ticket-Data --> ', eventData.ticketTypes);

      try {

         //await this.ticketService.createTickets(eventData.ticketTypes);

         this.logger.log(`Tickets Created successfully for Event`);

      } catch (error) {

         this.logger.error(`Ticket Creation Failed --- ${error.message}`);

         await this.amqpConnection.publish(
            'eventx.events',
            'event.creation.compensate',
            {
               eventId: eventData.eventId,
               reason: error.message
            },
            {
               persistent: true
            }
         );

         this.logger.warn(`Compensation Send Back`);
      }
   }
}