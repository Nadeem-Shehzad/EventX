import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";


@Injectable()
export class EventClient {

   private readonly logger = new Logger(EventClient.name);
   constructor(private readonly httpService: HttpService) { }

   async findEventById(eventId: String) {
      try {
         
         const response = await firstValueFrom(
            this.httpService.get(`/events/internal/${eventId}`, {
               headers: {
                  'x-internal-api-key': process.env.INTERNAL_API_KEY
               }
            })
         );

         return response.data;

      } catch (error) {
         this.logger.error(`Failed to fetch event ${eventId}: ${error.message}`);
         return null;
      }
   }
}