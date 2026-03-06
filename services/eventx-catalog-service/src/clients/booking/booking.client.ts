import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";


@Injectable()
export class BookingClient {

   private readonly logger = new Logger(BookingClient.name);
   constructor(private readonly httpService: HttpService) { }

   async findBookingById(bookingId: String) {
      try {

         const response = await firstValueFrom(
            this.httpService.get(`/bookings/internal/${bookingId}`, {
               headers: {
                  'x-internal-api-key': process.env.INTERNAL_API_KEY
               }
            })
         );

         return response.data;

      } catch (error) {
         this.logger.error(`Failed to fetch Booking -> ${bookingId}: ${error.message}`);
         return null;
      }
   }
}