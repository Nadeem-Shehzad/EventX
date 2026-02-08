import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';


@Injectable()
export class MetricsService {

   bookingCreated: client.Counter<string>;
   bookingFailed: client.Counter<string>;
   bookingCancelled: client.Counter<string>;

   constructor() {
      // ⭐ VERY IMPORTANT (node/system metrics)
      client.collectDefaultMetrics();

      this.bookingCreated = new client.Counter({
         name: 'booking_created_total',
         help: 'Total successful bookings',
      });

      this.bookingFailed = new client.Counter({
         name: 'booking_failed_total',
         help: 'Total failed bookings',
      });

      this.bookingCancelled = new client.Counter({
         name: 'booking_cancelled_total',
         help: 'Total Cancelled Bookings',
      });
   }

   incBookingCreated() {
      this.bookingCreated.inc();
   }

   incBookingFailed() {
      this.bookingFailed.inc();
   }

   incBookingCancelled() {
      this.bookingCancelled.inc();
   }

}