import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { EventRespository } from "./event.repository";
import slugify from "slugify";
import { plainToInstance } from "class-transformer";
import { EventResponseDTO } from "./dto/response/event-response.dto";
import { CreateEventDTO } from "./dto/request/create-event.dto";
import { EventQueryDTO } from "./dto/request/event-query.dto";
import { RedisService } from "src/redis/redis.service";
import { UpdateEventDTO } from "./dto/request/update-event.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { QUEUES } from "src/queue/queue.constants";
import { Queue } from "bullmq";
import { TicketService } from "../ticket/ticket.service";
import { Connection, Types } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { CreateTicketDTO } from "../ticket/dto/request/create-ticket.dto";


@Injectable()
export class EventService {
   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly eventRepo: EventRespository,
      private readonly redis: RedisService,
      @InjectQueue(QUEUES.EVENT_IMAGE)
      private readonly imageQueue: Queue,
      private readonly ticketService: TicketService
   ) { }

   private readonly logger = new Logger(EventService.name);


   async createEvent(id: string, dto: CreateEventDTO) {

      const session = await this.connection.startSession();
      session.startTransaction();

      try {
         const slug = slugify(dto.title, { lower: true }) + '-' + Date.now();

         const organizer = { organizerId: id }
         const slugObj = { slug };
         const dataObject = { ...dto, ...organizer, ...slugObj };

         const event = await this.eventRepo.create(dataObject, dto, session);

         const ticketTypesData = dto.ticketTypes.map(tt => ({
            ...tt,
            eventId: event._id,
            availableQuantity: tt.totalQuantity
         }));

         await this.ticketService.createTickets(ticketTypesData, session);

         await session.commitTransaction();

         return {
            eventId: event._id.toString(),
            message: 'Event created successfully'
         };

      } catch (error) {
         await session.abortTransaction();
         console.error('Transaction failed for createEvent', { error });
         throw error;

      } finally {
         session.endSession();
      }
   }


   async updateEvent(eventId: string, dataToUpdate: UpdateEventDTO) {

      const session = await this.connection.startSession();
      session.startTransaction();

      const event = await this.eventRepo.findEventById(eventId);
      if (!event) {
         throw new NotFoundException('Event not Found!');
      }

      if (dataToUpdate.title) {
         const slug = slugify(dataToUpdate.title);
         dataToUpdate.slug = slug;
      }

      const newImagePublicId = dataToUpdate.bannerImage?.publicId;
      const oldImagePublicId = event.bannerImage?.publicId;

      try {
         if (dataToUpdate.ticketTypes?.length) {
            for (const tt of dataToUpdate.ticketTypes) {
               if (tt._id) {

                  const existingTicket = await this.ticketService.findTicketById(tt._id, session);
                  if (!existingTicket) throw new Error(`TicketType not found: ${tt._id}`);

                  const sold = existingTicket.soldQuantity;
                  const reserved = existingTicket.reservedQuantity;

                  if (tt.totalQuantity !== undefined && tt.totalQuantity < sold + reserved) {
                     throw new Error('Total quantity cannot be less than sold + reserved');
                  }

                  if (tt.name && tt.name !== existingTicket.name) {

                     const conflict = await this.ticketService.findOne(
                        eventId,
                        tt.name,
                        tt._id,
                        session
                     );

                     if (conflict) throw new Error(`TicketType name "${tt.name}" already exists for this event`);
                  }

                  await this.ticketService.updateOne(
                     tt._id,
                     tt,
                     sold,
                     reserved,
                     existingTicket,
                     session
                  );

               } else {

                  if (tt.name) {
                     const conflict = await this.ticketService.findOne2(eventId, tt.name, session);

                     if (conflict) {
                        throw new Error(`TicketType name "${tt.name}" already exists for this event`);
                     }
                  }

                  const ticket: CreateTicketDTO = {
                     name: tt.name!,
                     eventId: new Types.ObjectId(eventId),
                     totalQuantity: tt.totalQuantity!,
                     availableQuantity: tt.totalQuantity!,
                     price: tt.price!,
                     isPaidEvent: tt.isPaidEvent!,
                     currency: tt.currency!
                  };

                  await this.ticketService.saveTickets(ticket, session);
               }
            }
         }

         const result = await this.eventRepo.updateEvent(eventId, dataToUpdate, session);
         await session.commitTransaction();

         if (newImagePublicId && newImagePublicId !== oldImagePublicId) {
            await this.imageQueue.add(
               'delete-old-event-image',
               {
                  publicId: oldImagePublicId,
                  eventId,
               },
               {
                  attempts: 3,
                  backoff: { type: 'exponential', delay: 3000 },
               },
            );
         }

         if (result) {
            return 'Event Record Updated.';
         }

         return 'Event Record not Updated!';

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   async getAllEvents() {
      const events = await this.eventRepo.getEventsByAggregation();

      return plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });
   }


   async getAllEventsByAggregate(page = 1, limit = 10) {

      const cacheKey = `all-event-${page}-${limit}`;

      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
         return JSON.parse(cachedData);
      }

      const { events, total } = await this.eventRepo.getEventsByAggregation(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      const response = {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };

      await this.redis.set(
         cacheKey,
         JSON.stringify(response),
         60
      );

      return response;
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

      const cacheKey = `free-event-${page}-${limit}`;

      try {
         const cachedData = await this.redis.get(cacheKey);
         if (cachedData) {
            return JSON.parse(cachedData);
         }
      } catch (error) {
         this.logger.warn('Redis unavailable, falling back to DB', 'Cache');
      }

      const { events, total } = await this.eventRepo.getFreeEvents(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      const response = {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };

      try {
         await this.redis.set(cacheKey, JSON.stringify(response), 60);
      } catch (err) {
         Logger.warn('Failed to cache free events', 'Cache');
      }

      return response;
   }


   async getPaidEvents(page = 1, limit = 10) {

      const cacheKey = `paid-event-${page}-${limit}`;

      try {
         const cachedData = await this.redis.get(cacheKey);
         if (cachedData) {
            return JSON.parse(cachedData);
         }
      } catch (error) {
         this.logger.warn('Redis unavailable, falling back to DB', 'Cache');
      }

      const { events, total } = await this.eventRepo.getPaidEvents(page, limit);

      const finalResult = plainToInstance(EventResponseDTO, events, {
         excludeExtraneousValues: true
      });

      const response = {
         events: finalResult,
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };

      try {
         await this.redis.set(cacheKey, JSON.stringify(response), 120);
      } catch (err) {
         Logger.warn('Failed to cache paid events', 'Cache');
      }

      return response;
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


   async eventStatusSummary() {
      return await this.eventRepo.eventStatusSummary();
   }


   async eventVisibilitySummary() {
      return await this.eventRepo.eventVisibilitySummary();
   }


   async eventTypeSummary() {
      return await this.eventRepo.eventTypeSummary();
   }


   async eventTagsSummary() {
      return await this.eventRepo.eventTagsSummary();
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


   async softDeleteEvent(eventId: string, organizerId: string) {
      console.log('inside soft delete...');
      const result = await this.eventRepo.softDeleteEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException(
            'Event cannot be Deleted or you are not authorized',
         );
      }

      return 'Event Deleted Successfully';
   }


   async deleteEventPermanently(eventId: string, organizerId: string) {

      const session = await this.connection.startSession();
      session.startTransaction();

      try {

         const deletedEvent = await this.eventRepo.deleteEventPermanently(eventId, organizerId, session);
         if (!deletedEvent) {
            throw new BadRequestException(
               'Event cannot be Deleted permanently or you are not authorized',
            );
         }

         await this.ticketService.deleteManyTickets(eventId, session);

         await session.commitTransaction();

         if (deletedEvent.bannerImage.publicId) {

            await this.imageQueue.add(
               'delete-event-image',
               {
                  publicId: deletedEvent.bannerImage.publicId,
                  eventId,
               },
               {
                  attempts: 3,
                  backoff: { type: 'exponential', delay: 3000 },
               },
            );
         }

         return 'Event deleted Permanently';

      } catch (error) {
         await session.abortTransaction();
         throw error;

      } finally {
         session.endSession();
      }
   }


   async recoverDeletedEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.recoverDeletedEvent(eventId, organizerId);
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