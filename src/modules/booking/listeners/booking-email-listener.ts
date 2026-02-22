import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { EmailJob } from "src/constants/email-queue.constants";
import { EventService } from "src/modules/event/event.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class BookingEmailListener {

   constructor(
      private readonly amqpConnection: AmqpConnection,
      private readonly userService: UserService,
      private readonly eventService: EventService
   ) { }

   @OnEvent(EmailJob.BOOKING_SUCCESS)
   async handleBookingCreated(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {
      const user = await this.userService.getUserById(payload.userId);
      if (!user) return;

      const event = await this.eventService.findById(payload.eventId);
      if (!event) return;

      await this.amqpConnection.publish(
         'eventx.events',          // exchange
         'booking.confirmed',      // routing key
         {
            bookingId: payload.bookingId,
            eventName: event.title,
            userName: user.name,
            email: user.email
         }
      );
   }

   @OnEvent(EmailJob.BOOKING_CANCEL)
   async handleBookingCancel(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {
      const user = await this.userService.getUserById(payload.userId);
      if (!user) return;

      const event = await this.eventService.findById(payload.eventId);
      if (!event) return;

      await this.amqpConnection.publish(
         'eventx.events',
         'booking.cancelled',
         {
            bookingId: payload.bookingId,
            eventName: event.title,
            userName: user.name,
            email: user.email
         }
      );
   }

   @OnEvent(EmailJob.BOOKING_FAILED)
   async handleBookingFailed(payload: {
      userId: string,
      reason: string
   }) {
      const user = await this.userService.getUserById(payload.userId);

      await this.amqpConnection.publish(
         'eventx.events',
         'booking.failed',
         {
            userId: payload.userId,
            reason: payload.reason,
            email: user?.email
         }
      );
   }
}