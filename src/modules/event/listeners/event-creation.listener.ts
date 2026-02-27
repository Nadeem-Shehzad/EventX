import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { EventService } from "../event.service";


@Injectable()
export class TicketConsumer {

   private readonly logger = new Logger(TicketConsumer.name);

   constructor(
      private readonly eventService: EventService
   ) {
      console.log('🔥🔥🔥 TicketConsumer CONSTRUCTOR CALLED 🔥🔥🔥');
   }

   @RabbitSubscribe({
      exchange: 'eventx.events',
      routingKey: 'event.creation.compensate',
      queue: 'ticket.creation.failed',
      queueOptions: { durable: true },
      allowNonJsonMessages: true, // ← add this
      errorHandler: (channel, msg, error) => {
         console.log('🔥 ERROR IN SUBSCRIBER:', error); // ← add this
         console.log('🔥 RAW MESSAGE:', msg.content.toString()); // ← add this
      }
   })
   async handleCompensation(msg: any) {

      const { eventId, reason } = msg;

      console.log(`🔥 COMPENSATION HANDLER CALLED Event ID --> ${eventId}`);

      try {
         await this.eventService.deleteEventById(eventId);
         this.logger.log(`Ticket-Compensation  Event-Deleted Successfully.`);

      } catch (error) {
         this.logger.log(`Ticket-Compensation  Error in event-deletion --> ${error.message}`);
      }
   }
}