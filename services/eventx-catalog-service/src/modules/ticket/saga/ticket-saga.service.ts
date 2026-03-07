import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { BookingTicketHandler } from "./handlers/booking.handler";
import { TicketHandler } from "./handlers/ticket.handler";


@Injectable()
export class TicketSagaService {

   constructor(
      private readonly bookingHandler: BookingTicketHandler,
      private readonly ticketHandler: TicketHandler
   ) { }

   async handle(job: Job) {
      switch (job.name) {

         case DOMAIN_EVENTS.BOOKING_CREATED:
            return this.bookingHandler.handleBookingCreated(job.data);

         case DOMAIN_EVENTS.TICKET_SOLD:
            return this.ticketHandler.handleTicketSold(job.data);

         default:
            throw new Error(`Unknown job ${job.name}`);
      }
   }
}