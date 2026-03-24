import { Injectable } from '@nestjs/common';
import { HttpService } from '../../common/http/http.service';


@Injectable()
export class EventService {

   constructor(private http: HttpService) { }

   async getEvent(id: string) {
      const data = await this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/${id}`);
      return { ...data, id: id };
   }

   async getTickets(eventId: string) {
      return this.http.get(`${process.env.CATALOG_SERVICE_URL}/tickets/event/${eventId}`);
   }

   async getOrganizer(orgId: string) {
      return this.http.get(`${process.env.IDENTITY_SERVICE_URL}users/${orgId}`);
   }
}