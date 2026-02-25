import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { TicketService } from './../modules/ticket/ticket.service';


@Injectable()
export class BookingConsumer {

   private readonly logger = new Logger(BookingConsumer.name);

   constructor(private readonly ticketService: TicketService) { }


   @RabbitSubscribe({
      exchange: 'eventx.events',
      routingKey: 'event.created',
      queue: 'ticket.creation',
      queueOptions: { durable: true }
   })
   async handleBookingCreated(eventData: any) {

      this.logger.log("+++++ INSIDE MICROSERVICE --- TICKET-CREATION +++++");
      console.log('Ticket-Data --> ', eventData.ticketTypes);

      try {

         console.log('====================');
         console.log(`Ticket-Data --> ${eventData}`);
         console.log('====================');

         await this.ticketService.createTickets(eventData.ticketTypes);

         this.logger.log(`Tickets Created successfully for Event`);

      } catch (error) {
         this.logger.error(`Ticket Creation Failed --- ${error.message}`);
      }
   }
}