import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RedisService } from "src/redis/redis.service";


@Injectable()
export class BookingCacheListener {

   constructor(private readonly redis: RedisService) { }

   @OnEvent('booking.created')
   async handleBookingCreated(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {

      await this.redis.delPattern(`event-bookings:${payload.eventId}-*`);
      await this.redis.del(`event-bookings:${payload.eventId}`);

      await this.redis.delPattern(`all-bookings:*`);
      await this.redis.del(`all-bookings`);
   }


   @OnEvent('booking.updated')
   async handleBookingUpdated(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {

      await this.redis.delPattern(`event-bookings:${payload.eventId}-*`);
      await this.redis.del(`event-bookings:${payload.eventId}`);

      await this.redis.delPattern(`all-bookings:*`);
      await this.redis.del(`all-bookings`);
   }
}