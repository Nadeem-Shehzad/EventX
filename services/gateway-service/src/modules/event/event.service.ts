import { Injectable } from '@nestjs/common';
import { HttpService } from '../../common/http/http.service';
import { EventFilterInput } from './dto/event-filter.type.dto';


@Injectable()
export class EventService {

   constructor(private http: HttpService) { }

   async getEvent(id: string) {
      const data = await this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/${id}`);
      return { ...data, id: id };
   }

   async getOrganizer(organizerId: string) {
      if (!organizerId) return null;
      const data = await this.http.get(`${process.env.IDENTITY_SERVICE_URL}/users/internal/${organizerId}`);
      return {
         ...data,
         id: organizerId,
      };
   }

   async getTickets(eventId: string) {
      return await this.http.get(`${process.env.CATALOG_SERVICE_URL}/tickets/event/${eventId}`);
   }


   async getEvents(filter: EventFilterInput, page = 1, limit = 10) {
      const params = new URLSearchParams();

      if (filter.city) params.append('city', filter.city);
      if (filter.category) params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);
      if (filter.tags) params.append('tags', filter.tags);

      params.append('page', String(page));
      params.append('limit', String(limit));

      const data = await this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/filter?${params.toString()}`);

      return {
         data: data.events.map(e => ({ ...e, id: e._id?.toString() })),
         total: data.events.length,
         page,
         limit,
      };
   }
}