import { Injectable, Logger } from "@nestjs/common";
import {
   BookingConfirmedFailedPayload,
   BookingConfirmedPayload,
   BookingConfirmedRequestPayload
} from "src/constants/events/domain-event-payloads";
import { DOMAIN_EVENTS } from "src/constants/events/domain-events";
import { OutboxService } from "src/outbox/outbox.service";
import { BookingService } from "../../booking.service";
import { AGGREGATES } from "src/constants/events/domain-aggregate";
import { AppLogger } from "src/logging/logging.service";


@Injectable()
export class BookingsHandler {

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService,
      private readonly logger: AppLogger
   ) { }


   async handleBookingConfirmedRequest(data: BookingConfirmedRequestPayload) {

      this.logger.info({
         module: 'Booking',
         service: BookingsHandler.name,
         msg: 'Inside handleBookingConfirmedRequest',
         bookingId: data.bookingId,
      });

      const { bookingId } = data;
      const booking = await this.bookingService.confirmBookingRequest(bookingId, data.paymentIntent);

      if (!booking) {
         throw new Error('Booking not Confirmed');
      }

      const payload: BookingConfirmedPayload = {
         bookingId: booking._id.toString(),
         userId: booking.userId.toString(),
         eventId: booking.eventId.toString(),
         ticketTypeId: booking.ticketTypeId.toString(),
         quantity: booking.quantity
      }

      await this.emit(DOMAIN_EVENTS.BOOKING_CONFIRMED, bookingId, payload);
   }


   async handleBookingConfirmedFailed(data: BookingConfirmedFailedPayload) {

      this.logger.info({
         module: 'Booking',
         service: BookingsHandler.name,
         msg: 'Inside handleBookingConfirmedFailed ',
         bookingId: data.bookingId,
      });

      const { bookingId } = data;

      const booking = await this.bookingService.cancelBookingRequest(bookingId);
      if (!booking) {
         throw new Error('Booking not Cancelled');
      }

      if (booking.paymentIntentId) {
         const payload: BookingConfirmedFailedPayload = {
            bookingId: bookingId,
            paymentIntent: booking.paymentIntentId
         }

         await this.emit(DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST, bookingId, payload);
         return;
      }

      const payload = {};
      await this.emit(DOMAIN_EVENTS.BOOKING_CANCELLED, bookingId, payload);
   }


   async handleBookingConfirmed(data: BookingConfirmedPayload) {

      this.logger.info({
         module: 'Booking',
         service: BookingsHandler.name,
         msg: 'Inside handleBookingConfirmed',
         eventId: data.eventId,
         bookingId: data.bookingId,
         ticketId: data.ticketTypeId
      });

      const { bookingId, eventId, userId } = data;
      await this.bookingService.bookingConfirmed(bookingId, eventId, userId);
   }


   async handleBookingPaymentFailed(data: BookingConfirmedRequestPayload) {

      this.logger.info({
         module: 'Booking',
         service: BookingsHandler.name,
         msg: 'Inside handleBookingPaymentFailed',
         bookingId: data.bookingId
      });

      const { bookingId } = data;
      await this.bookingService.cancelBookingRequest(bookingId);
   }


   async handleBookingPaymentRefunded(data: BookingConfirmedRequestPayload) {

      this.logger.info({
         module: 'Booking',
         service: BookingsHandler.name,
         msg: 'Inside handleBookingPaymentRefunded',
         bookingId: data.bookingId
      });

      const { bookingId } = data;
      await this.bookingService.markBookingRefunded(bookingId);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}