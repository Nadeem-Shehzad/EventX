import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { TicketsBookingHandler } from "./handlers/ticket.handler";
import { BookingsHandler } from "./handlers/booking.handler";


@Injectable()
export class BookingSagaService {

   constructor(
      private readonly ticketHandler: TicketsBookingHandler,
      private readonly bookingHandler: BookingsHandler
   ) { }

   async handle(job: Job) {

      switch (job.name) {

         case DOMAIN_EVENTS.TICKETS_RESERVED:
            return this.ticketHandler.handleTicketsReserved(job.data);

         case DOMAIN_EVENTS.TICKETS_FAILED:
            return this.ticketHandler.handleTicketsFailed(job.data);

         case DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED:
            return this.bookingHandler.handleBookingConfirmedRequest(job.data);

         case DOMAIN_EVENTS.BOOKING_PAYMENT_FAILED:
            return this.bookingHandler.handleBookingPaymentFailed(job.data);

         default:
            throw new Error(`Unknown job ${job.name}`);
      }
   }
}
