import { Injectable } from "@nestjs/common";
import { EventRespository } from "./event.repository";
import slugify from "slugify";


@Injectable()
export class EventService {
   constructor(private readonly eventRepo: EventRespository) { }

   async createEvent(data: any, id: string): Promise<string> {

      if (!data.slug) {
         data.slug = slugify(data.title);
      }

      const organizer = { organizerId: id }
      const dataObject = { ...data, ...organizer };

      const result = await this.eventRepo.create(dataObject);

      if (!result) {
         return 'Event not Added!.';
      }

      return 'Event Added successfully.';
   }


   async getAllEvents(){
      return await this.eventRepo.getEvents();
   }
}