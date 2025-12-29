import { Injectable, Logger } from "@nestjs/common";
import { EventRespository } from "./event.repository";
import slugify from "slugify";
import { plainToInstance } from "class-transformer";
import { EventResponseDTO } from "./dto/event-response.dto";
import { CreateEventDTO } from "./dto/create-event.dto";


@Injectable()
export class EventService {
   constructor(private readonly eventRepo: EventRespository) { }
   private readonly logger = new Logger(EventService.name);

   async createEvent(id: string, data: CreateEventDTO): Promise<string> {

      // this.logger.log(`Create Event Attempts ...`);

      const slug = slugify(data.title);

      const organizer = { organizerId: id }
      const slugObj = { slug };
      const dataObject = { ...data, ...organizer, ...slugObj };

      const result = await this.eventRepo.create(dataObject);

      if (!result) {
         return 'Event not Added!.';
      }
      return 'Event Added successfully.';
   }


   async getAllEvents() {
      const events = await this.eventRepo.getEventsByAggregation();

      return plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });
   }

   async getAllEventsByAggregate() {
      return await this.eventRepo.getEventsByAggregation();
   }
}