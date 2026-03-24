import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PipelineStage, Types } from 'mongoose';
import { EventDocument } from './schema/event.schema';
import { EventType } from './enums/event.enums';
import { UpdateEventDTO } from './dto/request/update-event.dto';
import { CreateEventDTO } from './dto/request/create-event.dto';
import { BasePipeline } from 'src/common/base/base.pipeline';
import { throwDbException } from 'src/common/utils/db-error.util';

@Injectable()
export class EventRepository extends BasePipeline<EventDocument> {

   constructor(
      @InjectModel('Event') private readonly eventModel: Model<EventDocument>
   ) {
      super(eventModel);
   }


   async create(data: any, session: ClientSession): Promise<EventDocument> {
      try {
         const result = await this.eventModel.create([data], { session, ordered: true });
         return result[0];
      } catch (err) {
         throwDbException(err, 'EventRepository.create');
      }
   }


   async updateEvent(id: string,dataToUpdate: UpdateEventDTO,session: ClientSession): Promise<EventDocument | null> {
      try {
         return await this.eventModel.findOneAndUpdate(
            { _id: id },
            { $set: dataToUpdate },
            { new: true, session }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.updateEvent');
      }
   }


   async deleteEventPermanently( eventId: string, organizerId: string,session: ClientSession): Promise<EventDocument | null> {
      try {
         return await this.eventModel.findOneAndDelete(
            { _id: eventId, organizerId, isDeleted: true },
            { session }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.deleteEventPermanently');
      }
   }


   async checkEventExist(organizerId: string,data: CreateEventDTO): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findOne({
               organizerId,
               title: data.title,
               startDateTime: data.startDateTime,
               'location.venueName': data.location?.venueName,
               'location.city': data.location?.city,
               'location.country': data.location?.country,
            }).exec(),
            { context: 'EventRepository.checkEventExist' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.checkEventExist');
      }
   }


   async findEventById(id: string): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findById(id).exec(),
            { context: 'EventRepository.findEventById' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.findEventById');
      }
   }


   async publishEvent(eventId: string,organizerId: string): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findOneAndUpdate(
               { _id: eventId, organizerId, status: 'draft' },
               { $set: { status: 'published' } },
               { new: true }
            ).exec(),
            { retry: false, context: 'EventRepository.publishEvent' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.publishEvent');
      }
   }


   async cancelEvent( eventId: string, organizerId: string ): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findOneAndUpdate(
               { _id: eventId, organizerId, status: { $in: ['draft', 'published'] } },
               { $set: { status: 'cancelled' } },
               { new: true }
            ).exec(),
            { retry: false, context: 'EventRepository.cancelEvent' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.cancelEvent');
      }
   }


   async softDeleteEvent(eventId: string, organizerId: string): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findOneAndUpdate(
               { _id: eventId, organizerId, isDeleted: false },
               { $set: { isDeleted: true, deletedAt: new Date() } },
               { new: true }
            ).exec(),
            { retry: false, context: 'EventRepository.softDeleteEvent' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.softDeleteEvent');
      }
   }


   async recoverDeletedEvent( eventId: string, organizerId: string): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findOneAndUpdate(
               { _id: eventId, organizerId, isDeleted: true },
               { $set: { isDeleted: false, deletedAt: null } },
               { new: true }
            ).exec(),
            { retry: false, context: 'EventRepository.recoverDeletedEvent' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.recoverDeletedEvent');
      }
   }

   
   async deleteEventHard(eventId: string): Promise<EventDocument | null> {
      try {
         return await this.safeQuery(
            () => this.eventModel.findByIdAndDelete(eventId).exec(),
            { retry: false, context: 'EventRepository.deleteEventHard' }
         );
      } catch (err) {
         throwDbException(err, 'EventRepository.deleteEventHard');
      }
   }

   // ── Aggregations — longer timeout, no retry (aggregations are not safely retryable) ──

   async getEventsByAggregation(
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      const skip = (page - 1) * limit;
      const pipeline: PipelineStage[] = [
         { $match: { status: 'published', isDeleted: false } },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                  { $project: { ...publicResponseData, ticketTypes: ticketTypeProjection } },
               ],
               totalCount: [{ $count: 'count' }],
            },
         },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.count ?? 0,
         })),
         {
            timeoutMs: 15000, // aggregations need more time
            retry: false,     // aggregations not safely retryable
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getEventsByAggregation'
         }
      );
   }

   async getEventsByFilter(
      filters: any,
      options: { limit: number; skip: number }
   ): Promise<{ events: any[]; meta: any }> {
      const pipeline: PipelineStage[] = [
         { $match: filters },
         { $sort: { startDateTime: 1 as const } },
         {
            $facet: {
               data: [
                  { $skip: options.skip },
                  { $limit: options.limit },
                  { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                  { $project: { ...publicResponseData, ticketTypes: ticketTypeProjection } },
               ],
               totalCount: [{ $count: 'count' }],
            },
         },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec().then(result => {
            const events = result[0]?.data ?? [];       // safe — was crashing on empty
            const total = result[0]?.totalCount?.[0]?.count ?? 0;
            return {
               events,
               meta: {
                  total,
                  page: Math.floor(options.skip / options.limit) + 1,
                  limit: options.limit,
                  totalPages: Math.ceil(total / options.limit),
               },
            };
         }),
         {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], meta: { total: 0, page: 1, limit: options.limit, totalPages: 0 } },
            context: 'EventRepository.getEventsByFilter'
         }
      );
   }

   async getFreeEvents(
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      return this.runPagedAggregation(
         { status: 'published', isDeleted: false, isPaid: false },
         page,
         limit,
         'EventRepository.getFreeEvents'
      );
   }

   async getPaidEvents(
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      return this.runPagedAggregation(
         { status: 'published', isDeleted: false, isPaid: true },
         page,
         limit,
         'EventRepository.getPaidEvents'
      );
   }

   async getUpcomingEvents(
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      return this.runPagedAggregation(
         { status: 'published', isDeleted: false, startDateTime: { $gte: new Date() } },
         page,
         limit,
         'EventRepository.getUpcomingEvents'
      );
   }

   async getOrganizerEvents(
      id: string,
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      const skip = (page - 1) * limit;
      const pipeline: PipelineStage[] = [
         { $match: { organizerId: new Types.ObjectId(id), isDeleted: false } },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  { $lookup: { from: 'users', localField: 'organizerId', foreignField: '_id', pipeline: [{ $project: { name: 1 } }], as: 'organizer' } },
                  { $unwind: { path: '$organizer', preserveNullAndEmptyArrays: true } },
                  { $project: administrativeResponseData },
               ],
               totalCount: [{ $count: 'total' }],
            },
         },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.total ?? 0,
         })),
         {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getOrganizerEvents'
         }
      );
   }

   async getOrganizerOwnEvents(
      id: string,
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      const skip = (page - 1) * limit;
      const pipeline: PipelineStage[] = [
         { $match: { organizerId: new Types.ObjectId(id) } },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  { $project: publicResponseData },
               ],
               totalCount: [{ $count: 'total' }],
            },
         },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.total ?? 0,
         })),
         {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getOrganizerOwnEvents'
         }
      );
   }

   async filterEventsByStatus(
      status: string,
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      return this.runPagedAggregation(
         { status, isDeleted: false },
         page, limit,
         'EventRepository.filterEventsByStatus'
      );
   }

   async filterEventsByVisibility(
      visibility: string,
      page = 1,
      limit = 10
   ): Promise<{ events: any[]; total: number }> {
      return this.runPagedAggregation(
         { visibility, isDeleted: false },
         page, limit,
         'EventRepository.filterEventsByVisibility'
      );
   }

   // ── Summary aggregations ──────────────────────────────────────

   async eventStatusSummary(): Promise<any[]> {
      return this.runSummaryAggregation('$status', 'status', 'EventRepository.eventStatusSummary');
   }

   async eventVisibilitySummary(): Promise<any[]> {
      return this.runSummaryAggregation('$visibility', 'visibility', 'EventRepository.eventVisibilitySummary');
   }

   async eventTypeSummary(): Promise<any[]> {
      return this.runSummaryAggregation('$eventType', 'eventType', 'EventRepository.eventTypeSummary');
   }

   async eventTagsSummary(): Promise<any[]> {
      const pipeline: PipelineStage[] = [
         { $match: { isDeleted: false } },
         { $unwind: '$tags' },
         { $group: { _id: '$tags', total: { $sum: 1 } } },
         { $sort: { total: 1 } },
         { $project: { _id: 0, tag: '$_id', total: 1 } },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec(),
         {
            timeoutMs: 15000,
            retry: false,
            fallback: [],
            context: 'EventRepository.eventTagsSummary'
         }
      );
   }

   // ── Export methods ────────────────────────────────────────────

   async findEventOwner(eventId: string): Promise<{ organizerId: string } | null> {
      return this.safeQuery(
         () => this.eventModel.aggregate([
            { $match: { _id: new Types.ObjectId(eventId) } },
            { $project: { organizerId: 1 } },
         ]).exec().then(r => r[0] ?? null),
         {
            timeoutMs: 5000,
            retry: false,
            fallback: null,
            context: 'EventRepository.findEventOwner'
         }
      );
   }

   // ── Private helpers — eliminate repeated aggregation boilerplate ──

   private async runPagedAggregation(
      match: object,
      page: number,
      limit: number,
      context: string
   ): Promise<{ events: any[]; total: number }> {
      const skip = (page - 1) * limit;
      const pipeline: PipelineStage[] = [
         { $match: match },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                  { $project: { ...publicResponseData, ticketTypes: ticketTypeProjection } },
               ],
               totalCount: [{ $count: 'count' }],
            },
         },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.count ?? 0,
         })),
         { timeoutMs: 15000, retry: false, fallback: { events: [], total: 0 }, context }
      );
   }

   private async runSummaryAggregation(
      groupField: string,
      projectField: string,
      context: string
   ): Promise<any[]> {
      const pipeline: PipelineStage[] = [
         { $match: { isDeleted: false } },
         { $group: { _id: groupField, total: { $sum: 1 } } },
         { $sort: { total: 1 } },
         { $project: { _id: 0, [projectField]: '$_id', total: 1 } },
      ];

      return this.safeQuery(
         () => this.eventModel.aggregate(pipeline).exec(),
         { timeoutMs: 15000, retry: false, fallback: [], context }
      );
   }
}

// ── Projection constants ──────────────────────────────────────────

const ticketTypeProjection = {
   name: 1,
   totalQuantity: 1,
   soldQuantity: 1,
   reservedQuantity: 1,
   price: 1,
   currency: 1,
   isPaidEvent: 1,
};

export const publicResponseData = {
   _id: { $toString: '$_id' },
   title: 1,
   description: 1,
   category: 1,
   tags: 1,
   eventType: 1,
   location: {
      $cond: [{ $ne: ['$eventType', EventType.ONLINE] }, '$location', '$$REMOVE']
   },
   bannerImage: 1,
   startDateTime: 1,
   endDateTime: 1,
   timezone: 1,
   capacity: 1,
   registeredCount: 1,
   isPaid: 1,
};

export const administrativeResponseData = {
   _id: { $toString: '$_id' },
   title: 1,
   description: 1,
   category: 1,
   tags: 1,
   eventType: 1,
   location: {
      $cond: [{ $ne: ['$eventType', EventType.ONLINE] }, '$location', '$$REMOVE']
   },
   bannerImage: 1,
   startDateTime: 1,
   endDateTime: 1,
   timezone: 1,
   capacity: 1,
   registeredCount: 1,
   isPaid: 1,
   priceRange: {
      $cond: [{ $eq: ['$isPaid', true] }, '$priceRange', '$$REMOVE']
   },
   organizer: { name: '$organizer.name' },
};