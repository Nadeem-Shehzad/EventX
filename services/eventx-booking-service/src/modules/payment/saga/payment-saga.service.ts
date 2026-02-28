import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { BookingPaymentHandler } from "./handlers/booking.handler";


@Injectable()
export class PaymentSagaService {

   constructor(
      private readonly bookingPaymentHandler: BookingPaymentHandler
   ) { }

   async handle(job: Job) {
      switch (job.name) {

         case DOMAIN_EVENTS.PAYMENT_REQUEST:
            return this.bookingPaymentHandler.handleBookingPaymentRequest(job.data);

         case DOMAIN_EVENTS.PAYMENT_FAILED:
            return this.bookingPaymentHandler.handleBookingPaymentFailed(job.data);

         case DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST:
            return this.bookingPaymentHandler.handleBookingPaymentRefundRequest(job.data);   

         default:
            throw new Error(`Unknown job ${job.name}`);
      }
   }
}