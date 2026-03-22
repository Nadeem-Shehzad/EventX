import { Injectable } from '@nestjs/common';
import { HttpService } from 'src/common/http/http.service';


@Injectable()
export class EventService {

   constructor(private http: HttpService) { }

   async getEvent(id: string) {
      console.log('----- INSIDE GET EVENT -----')
      //return this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/${id}`);
   }

   async getTickets(eventId: string) {
      return this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/${eventId}/tickets`);
   }

   async getOrganizer(orgId: string) {
      return this.http.get(`${process.env.IDENTITY_SERVICE_URL}users/${orgId}`);
   }
}