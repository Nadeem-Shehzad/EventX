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


@Injectable()
export class BookingsHandler {

   private readonly logger = new Logger(BookingsHandler.name);

   constructor(
      private readonly bookingService: BookingService,
      private readonly outboxService: OutboxService
   ) { }


   async handleBookingConfirmedRequest(data: BookingConfirmedRequestPayload) {

      this.logger.log('Inside handleBookingConfirmedRequest Handler in Booking-module');

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

      this.logger.log('Inside handleBookingConfirmedFailed Handler in Booking-module');

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

      this.logger.log('Inside handleBookingConfirmed Handler in Booking-module');

      const { bookingId, eventId, userId } = data;
      await this.bookingService.bookingConfirmed(bookingId, eventId, userId);
   }


   async handleBookingPaymentFailed(data: BookingConfirmedRequestPayload) {

      this.logger.log('Inside handleBookingPaymentFailed Handler in Booking-module');

      const { bookingId } = data;
      await this.bookingService.cancelBookingRequest(bookingId);
   }


   async handleBookingPaymentRefunded(data: BookingConfirmedRequestPayload) {

      this.logger.log('Inside handleBookingPaymentRefunded Handler in Booking-module');

      const { bookingId } = data;
      await this.bookingService.markBookingRefunded(bookingId);
   }


   private async emit(event: string, aggregateId: string, payload: any) {
      await this.outboxService.addEvent(AGGREGATES.BOOKING, aggregateId, event, payload);
   }
}