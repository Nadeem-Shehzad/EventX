import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { TicketsBookingHandler } from "./handlers/ticket.handler";


@Injectable()
export class BookingSagaService {

   constructor(
      private readonly ticketHandler: TicketsBookingHandler,
   ) { }

   async handle(job: Job) {

      switch (job.name) {

         case DOMAIN_EVENTS.TICKETS_RESERVED:
            return this.ticketHandler.handleTicketsReserved(job.data);

         //   case DOMAIN_EVENTS.TICKETS_FAILED:
         //     return this.handleTicketsFailed(job.data);

         default:
            throw new Error(`Unknown job ${job.name}`);
      }
   }
}
