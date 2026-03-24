import {
   BadRequestException,
   ConflictException,
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
   ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import slugify from 'slugify';
import { plainToInstance } from 'class-transformer';

import { EventRepository } from './event.repository';
import { RedisService } from 'src/redis/redis.service';
import { TicketService } from '../ticket/ticket.service';
import { EventOutboxService } from './outbox/event-outbox.service';
import { QUEUES } from 'src/queue/queue.constants';
import { CreateEventDTO } from './dto/request/create-event.dto';
import { UpdateEventDTO } from './dto/request/update-event.dto';
import { EventQueryDTO } from './dto/request/event-query.dto';
import { EventResponseDTO } from './dto/response/event-response.dto';
import { CreateTicketDTO } from '../ticket/dto/request/create-ticket.dto';

// ── Redis cache helper ────────────────────────────────────────────
// Centralizes the repeated get→miss→fetch→set pattern used across methods
// Redis is non-critical — miss or failure always falls through to DB
interface CacheOptions<T> {
   key: string;
   ttlSeconds: number;
   fallbackFn: () => Promise<T>;
   logger: Logger;
   redis: RedisService;
}

async function withCache<T>(opts: CacheOptions<T>): Promise<T> {
   // Try cache read — failure falls through silently
   try {
      const cached = await opts.redis.get(opts.key);
      if (cached) return JSON.parse(cached);
   } catch (err) {
      opts.logger.warn(`Redis read failed for key ${opts.key}: ${err.message}`);
   }

   // Cache miss or Redis down — hit DB
   const result = await opts.fallbackFn();

   // Try cache write — failure is non-critical, never throws
   try {
      await opts.redis.set(opts.key, JSON.stringify(result), opts.ttlSeconds);
   } catch (err) {
      opts.logger.warn(`Redis write failed for key ${opts.key}: ${err.message}`);
   }

   return result;
}

// ── Queue helper ──────────────────────────────────────────────────
// Queue failures must never crash core flows — always fire-and-forget
async function enqueueFireAndForget(
   queue: Queue,
   jobName: string,
   data: object,
   logger: Logger,
   context: string
): Promise<void> {
   queue
      .add(jobName, data, {
         attempts: 3,
         backoff: { type: 'exponential', delay: 3000 },
      })
      .catch(err =>
         logger.error(`Queue enqueue failed [${context}]: ${err.message}`)
      );
}

@Injectable()
export class EventService {

   private readonly logger = new Logger(EventService.name);

   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly eventRepo: EventRepository,
      private readonly redis: RedisService,
      @InjectQueue(QUEUES.EVENT_IMAGE) private readonly imageQueue: Queue,
      private readonly ticketService: TicketService,
      private readonly eventOutboxService: EventOutboxService,
   ) { }

   // ── Create ────────────────────────────────────────────────────

   async createEvent(organizerId: string, dto: CreateEventDTO) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
         const existingEvent = await this.eventRepo.checkEventExist(organizerId, dto);
         if (existingEvent) {
            throw new ConflictException('Event with same title, date and venue already exists');
         }

         const slug = `${slugify(dto.title, { lower: true })}-${Date.now()}`;
         const dataObject = { ...dto, organizerId, slug };

         const event = await this.eventRepo.create(dataObject, session);

         const ticketTypesData = dto.ticketTypes.map(tt => ({
            ...tt,
            eventId: event._id,
            availableQuantity: tt.totalQuantity,
         }));

         await this.ticketService.createTickets(ticketTypesData, session);

         await session.commitTransaction();

         return {
            eventId: event._id.toString(),
            message: 'Event created successfully',
         };

      } catch (err) {
         await session.abortTransaction();
         throw err;
      } finally {
         session.endSession();
      }
   }

   // ── Update ────────────────────────────────────────────────────

   async updateEvent(eventId: string, dataToUpdate: UpdateEventDTO) {
      // Find event BEFORE starting session — if not found, no session needed
      const event = await this.eventRepo.findEventById(eventId);
      if (!event) throw new NotFoundException('Event not found');

      if (dataToUpdate.title) {
         dataToUpdate.slug = slugify(dataToUpdate.title, { lower: true });
      }

      const newImagePublicId = dataToUpdate.bannerImage?.publicId;
      const oldImagePublicId = event.bannerImage?.publicId;

      const session = await this.connection.startSession();
      session.startTransaction();

      try {
         if (dataToUpdate.ticketTypes?.length) {
            for (const tt of dataToUpdate.ticketTypes) {
               if (tt._id) {
                  const existingTicket = await this.ticketService.findTicketById(tt._id, session);
                  if (!existingTicket) throw new NotFoundException(`Ticket type not found: ${tt._id}`);

                  const { soldQuantity: sold, reservedQuantity: reserved } = existingTicket;

                  if (tt.totalQuantity !== undefined && tt.totalQuantity < sold + reserved) {
                     throw new BadRequestException('Total quantity cannot be less than sold + reserved');
                  }

                  if (tt.name && tt.name !== existingTicket.name) {
                     const conflict = await this.ticketService.findConflictingTicketName(eventId, tt.name, tt._id, session);
                     if (conflict) {
                        throw new ConflictException(`Ticket type name "${tt.name}" already exists for this event`);
                     }
                  }

                  //await this.ticketService.updateOne(tt._id, tt, sold, reserved, existingTicket, session);

               } else {
                  if (tt.name) {
                     const conflict = await this.ticketService.findTicketByName(eventId, tt.name, session);
                     if (conflict) {
                        throw new ConflictException(`Ticket type name "${tt.name}" already exists for this event`);
                     }
                  }

                  const ticket: CreateTicketDTO = {
                     name: tt.name!,
                     eventId: new Types.ObjectId(eventId),
                     totalQuantity: tt.totalQuantity!,
                     availableQuantity: tt.totalQuantity!,
                     price: tt.price!,
                     isPaidEvent: tt.isPaidEvent!,
                     currency: tt.currency!,
                  };

                  await this.ticketService.saveTickets(ticket, session);
               }
            }
         }

         const result = await this.eventRepo.updateEvent(eventId, dataToUpdate, session);
         await session.commitTransaction();

         // Queue is non-critical — fires after commit, never blocks response
         // If queue fails, old image stays in Cloudinary — acceptable, can be cleaned up later
         if (newImagePublicId && newImagePublicId !== oldImagePublicId && oldImagePublicId) {
            enqueueFireAndForget(
               this.imageQueue,
               'delete-old-event-image',
               { publicId: oldImagePublicId, eventId },
               this.logger,
               'updateEvent.deleteOldImage'
            );
         }

         return result ? 'Event updated successfully' : 'Event not updated';

      } catch (err) {
         await session.abortTransaction();
         throw err;
      } finally {
         session.endSession();
      }
   }

   // ── Reads ─────────────────────────────────────────────────────

   async getAllEventsByAggregate(page = 1, limit = 10) {
      return withCache({
         key: `all-events-${page}-${limit}`,
         ttlSeconds: 60,
         redis: this.redis,
         logger: this.logger,
         fallbackFn: async () => {
            const { events, total } = await this.eventRepo.getEventsByAggregation(page, limit);
            return {
               events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
               meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
         },
      });
   }

   async getEventsByFilter(query: EventQueryDTO) {
      const { category, tags, city, search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const filters: any = { status: 'published', isDeleted: false };
      if (category) filters.category = category;
      if (tags?.length) filters.tags = { $in: tags };
      if (city) filters['location.city'] = city;
      if (search) filters.title = { $regex: search, $options: 'i' };

      // Filter queries are dynamic — not safe to cache (too many key combinations)
      return this.eventRepo.getEventsByFilter(filters, { limit, skip });
   }

   async getFreeEvents(page = 1, limit = 10) {
      return withCache({
         key: `free-events-${page}-${limit}`,
         ttlSeconds: 60,
         redis: this.redis,
         logger: this.logger,
         fallbackFn: async () => {
            const { events, total } = await this.eventRepo.getFreeEvents(page, limit);
            return {
               events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
               meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
         },
      });
   }

   async getPaidEvents(page = 1, limit = 10) {
      return withCache({
         key: `paid-events-${page}-${limit}`,
         ttlSeconds: 120,
         redis: this.redis,
         logger: this.logger,
         fallbackFn: async () => {
            const { events, total } = await this.eventRepo.getPaidEvents(page, limit);
            return {
               events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
               meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
         },
      });
   }

   async getUpcomingEvents(page = 1, limit = 10) {
      return withCache({
         key: `upcoming-events-${page}-${limit}`,
         ttlSeconds: 60,
         redis: this.redis,
         logger: this.logger,
         fallbackFn: async () => {
            const { events, total } = await this.eventRepo.getUpcomingEvents(page, limit);
            return {
               events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
               meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
         },
      });
   }

   async getOrganizerEvents(id: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getOrganizerEvents(id, page, limit);
      return {
         events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
         meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
   }

   async getOrganizerOwnEvents(id: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.getOrganizerOwnEvents(id, page, limit);
      return {
         events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
         meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
   }

   // ── Status / visibility changes ───────────────────────────────

   async publishEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.publishEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException('Event cannot be published or you are not authorized');
      }
      return plainToInstance(EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
   }

   async cancelEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.cancelEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException('Event cannot be cancelled or you are not authorized');
      }
      return plainToInstance(EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
   }

   async softDeleteEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.softDeleteEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException('Event cannot be deleted or you are not authorized');
      }
      return { message: 'Event deleted successfully' };
   }

   async recoverDeletedEvent(eventId: string, organizerId: string) {
      const result = await this.eventRepo.recoverDeletedEvent(eventId, organizerId);
      if (!result) {
         throw new BadRequestException('Event cannot be recovered or you are not authorized');
      }
      return plainToInstance(EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
   }

   // ── Permanent delete ──────────────────────────────────────────

   async deleteEventPermanently(eventId: string, organizerId: string) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
         const deletedEvent = await this.eventRepo.deleteEventPermanently(eventId, organizerId, session);
         if (!deletedEvent) {
            throw new BadRequestException('Event cannot be permanently deleted or you are not authorized');
         }

         await this.ticketService.deleteManyTickets(eventId, session);
         await session.commitTransaction();

         // Queue is non-critical — fires after commit without blocking response
         if (deletedEvent.bannerImage?.publicId) {
            enqueueFireAndForget(
               this.imageQueue,
               'delete-event-image',
               { publicId: deletedEvent.bannerImage.publicId, eventId },
               this.logger,
               'deleteEventPermanently.deleteImage'
            );
         }

         return { message: 'Event deleted permanently' };

      } catch (err) {
         await session.abortTransaction();
         throw err;
      } finally {
         session.endSession();
      }
   }

   // ── Summaries ─────────────────────────────────────────────────

   async filterEventsByStatus(status: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.filterEventsByStatus(status, page, limit);
      return {
         events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
         meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
   }

   async filterEventsByVisibility(visibility: string, page = 1, limit = 10) {
      const { events, total } = await this.eventRepo.filterEventsByVisibility(visibility, page, limit);
      return {
         events: plainToInstance(EventResponseDTO, events, { excludeExtraneousValues: true }),
         meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
   }

   async eventStatusSummary() { return this.eventRepo.eventStatusSummary(); }
   async eventVisibilitySummary() { return this.eventRepo.eventVisibilitySummary(); }
   async eventTypeSummary() { return this.eventRepo.eventTypeSummary(); }
   async eventTagsSummary() { return this.eventRepo.eventTagsSummary(); }

   // ── Export methods ────────────────────────────────────────────

   async findById(id: string) {
      return this.eventRepo.findEventById(id);
   }

   async findEventOwner(id: string) {
      return this.eventRepo.findEventOwner(id);
   }

   async deleteEventById(eventId: string) {
      const result = await this.eventRepo.deleteEventHard(eventId);
      if (!result) throw new NotFoundException('Event not found');
      return result;
   }
}