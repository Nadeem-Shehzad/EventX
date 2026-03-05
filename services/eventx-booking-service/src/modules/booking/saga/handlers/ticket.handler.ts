import { Injectable, Logger } from "@nestjs/common";
import {
   BookingConfirmedRequestPayload,
   BookingCreatedPayload,
   PaymentRequestPayload,
   TicketsReservedFailedPayload,
   TicketsReservedPayload,
   TicketsSoldPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class TicketsBookingHandler {

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }


   async handleTicketsReserved(data: TicketsReservedPayload) {
      const { bookingId, isPaid, quantity, ticketTypeId, price } = data;

      console.log('...............................');
      console.log('H E L L O  W O R L D');
      console.log(`Event is Free -> ${isPaid}`);
      console.log('...............................');

      this.logger.info({
         module: 'Booking',
         service: TicketsBookingHandler.name,
         msg: 'Inside handleTicketRserved',
         bookingId: data.bookingId
      });

      try {

         // if (!isPaid) {
         //    const payload: BookingConfirmedRequestPayload = { bookingId };
         //    await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRM_REQUESTED, bookingId, payload);
         // }

         if (isPaid) {
            console.log('%%%%%%%%%%%%% FREE EVENT %%%%%%%%%%%%%%%%');
            const payload: TicketsSoldPayload = { bookingId, ticketTypeId, quantity };
            return await this.emit(DOMAIN_EVENTS.TICKETS_SOLD, bookingId, payload);
         }

         const payload: PaymentRequestPayload = {
            bookingId,
            amount: quantity * price,
            currency: 'PKR'
         }

         await this.emit(DOMAIN_EVENTS.PAYMENT_REQUEST, bookingId, payload);

      } catch (error) {
         // 3️⃣ Failure path → emit failure event
         // const payload: BookingCreatedPayload = {
         //    bookingId,
         //    userId,
         //    eventId,
         //    ticketTypeId,
         //    quantity
         // }

         // await this.outboxService.addEvent<BookingCreatedPayload>(
         //    'Booking',
         //    bookingId,
         //    DOMAIN_EVENTS.TICKETS_FAILED,
         //    payload,
         //    undefined
         // );

         throw error; // allow BullMQ retry
      }
   }


   async handleTicketsFailed(data: TicketsReservedFailedPayload) {

      // this.logger.info({
      //    module: 'Booking',
      //    service: TicketsBookingHandler.name,
      //    msg: 'Inside handleTicketsFailed',
      // });

      // console.log('---------------- INSIDE HANDLE-TICKETS-FAILED --------------');

      const { bookingId, reason } = data;
      await this.bookingService.bookingFailed(bookingId);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.PAYMENT, aggregateId, event, payload);
   }
}