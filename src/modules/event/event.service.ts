import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { EventRespository } from "./event.repository";
import slugify from "slugify";
import { plainToInstance } from "class-transformer";
import { EventResponseDTO } from "./dto/event-response.dto";
import { CreateEventDTO } from "./dto/create-event.dto";
import { EventQueryDTO } from "./dto/event-query.dto";
import { optional } from "joi";


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


   async getEventsByFilter(query: EventQueryDTO) {

      const { category, tags, city, search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const filters: any = {
         status: 'published',
         isDeleted: false
      }

      // if category is sent from user
      if (category) {
         filters.category = category;
      }

      if (tags?.length) {
         filters.tags = { $in: tags }
      }

      if (city) {
         filters['location.city'] = city;
      }

      if (search) {
         filters.title = { $regex: search, $options: 'i' }
      }

      return await this.eventRepo.getEventsByFilter(filters, { limit, skip });
   }


   async getFreeEvents(page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getFreeEvents(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async getPaidEvents(page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getPaidEvents(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async getOrganizerEvents(id: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getOrganizerEvents(id, page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async getOrganizerOwnEvents(id: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getOrganizerOwnEvents(id, page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async filterEventsByStatus(status: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.filterEventsByStatus(status, page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async filterEventsByVisibility(visibility: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.filterEventsByVisibility(visibility, page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async getUpcomingEvents(page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getUpcomingEvents(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      return {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }


   async publishEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.publishEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException(
            'Event cannot be published or you are not authorized',
         );
      }

      const eventObject = result.toObject();

      return plainToInstance(EventResponseDTO, eventObject, {
         excludeExtraneousValues: true,
      });
   }


   async cancelEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.cancelEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException(
            'Event cannot be Cancelled or you are not authorized',
         );
      }

      const eventObject = result.toObject();

      return plainToInstance(EventResponseDTO, eventObject, {
         excludeExtraneousValues: true,
      });
   }


   async deleteEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.deleteEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException(
            'Event cannot be Deleted or you are not authorized',
         );
      }

      const eventObject = result.toObject();

      return plainToInstance(EventResponseDTO, eventObject, {
         excludeExtraneousValues: true,
      });
   }


   async recoverDeleteEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.recoverDeleteEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException(
            'Event cannot be Recovered or you are not authorized',
         );
      }

      const eventObject = result.toObject();

      return plainToInstance(EventResponseDTO, eventObject, {
         excludeExtraneousValues: true,
      });
   }



   // export services
   async findById(id: string) {
      return await this.eventRepo.findEventById(id);
   }

   async findEventOwner(id: string) {
      return await this.eventRepo.findEventOwner(id);
   }
}