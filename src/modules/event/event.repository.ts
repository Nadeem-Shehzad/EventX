import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { EventDocument } from "./event.schema";
import { MongoPerformanceHelper } from "src/common/helpers/db-performance-checker";


@Injectable()
export class EventRespository {
   
   constructor(@InjectModel('Event') private eventModel: Model<EventDocument>) { }
   
   private readonly logger = new Logger(EventRespository.name);


   async create(data: any): Promise<EventDocument | null> {
      return await this.eventModel.create(data);
   }


   async getEvents() {
      const events = await this.eventModel.find({}).lean();

      return events.map(event => ({
         ...event,
         _id: event._id.toString(),
      }));
   }


   async getEventsByAggregation() {
      return await this.eventModel.aggregate([
         { $match: { status: 'published', isDeleted: false } },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               data: [
                  { $skip: 0 },
                  { $limit: 10 },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: {
                           $cond: [
                              { $eq: ['$isPaid', true] },
                              '$priceRange',
                              '$$REMOVE'
                           ]
                        }
                     }
                  }
               ]
            }
         }
      ]);
   }


   async getEventsByFilter(filters: any, options: { limit: number; skip: number }) {
      const pipeline: PipelineStage[] = [
         { $match: filters },
         { $sort: { startDateTime: 1 as const } },
         {
            $facet: {
               data: [
                  { $skip: options.skip },
                  { $limit: options.limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        category: 1,
                        tags: 1,
                        startDateTime: 1,
                        isPaid: 1,
                        price: 1,
                        location: 1,
                     }
                  }
               ],
               totalCount: [
                  { $count: 'count' }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0].data;
      const total = result[0].totalCount[0]?.count || 0;

      return {
         events,
         meta: {
            total,
            page: Math.floor(options.skip / options.limit) + 1,
            limit: options.limit,
            totalPages: Math.ceil(total / options.limit)
         }
      };
   }


   async getFreeEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               status: 'published',
               isDeleted: false,
               isPaid: false,
            },
         },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
               ],
               totalCount: [{ $count: 'count' }],
            },
         },
      ];

      const result = await this.eventModel.aggregate(pipeline);

      // const perfStats = await MongoPerformanceHelper.checkAggregationPerformance(this.eventModel, pipeline);
      // console.log(perfStats);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.count ?? 0;

      return { events, total };
   }


   async getPaidEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               status: 'published',
               isDeleted: false,
               isPaid: true,
            },
         },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [{ $count: 'count' }],
            },
         },
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.count ?? 0;

      return { events, total };
   }


   async getOrganizerEvents(id: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               organizerId: id,
               isDeleted: false
            }
         },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [
                  {
                     $count: 'total'
                  }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.total ?? 0;

      return { events, total };
   }


   async getOrganizerOwnEvents(id: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               organizerId: id,
               isDeleted: false
            }
         },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [
                  {
                     $count: 'total'
                  }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.total ?? 0;

      return { events, total };
   }


   async filterEventsByStatus(status: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               status: status,
               isDeleted: false
            }
         },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [
                  {
                     $count: 'total'
                  }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.total ?? 0;

      return { events, total };
   }


   async filterEventsByVisibility(visibility: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               visibility: visibility,
               isDeleted: false
            }
         },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [
                  {
                     $count: 'total'
                  }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.total ?? 0;

      return { events, total };
   }


   async getUpcomingEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const now = new Date();

      const pipeline: PipelineStage[] = [
         {
            $match: {
               status: 'published',
               isDeleted: false,
               startDateTime: { $gte: now }
            }
         },
         { $sort: { startDateTime: 1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        description: 1,
                        category: 1,
                        tags: 1,
                        eventType: 1,
                        location: 1,
                        bannerImage: 1,
                        startDateTime: 1,
                        endDateTime: 1,
                        timezone: 1,
                        capacity: 1,
                        registeredCount: 1,
                        isPaid: 1,
                        priceRange: 1
                     }
                  }
               ],
               totalCount: [
                  {
                     $count: 'total'
                  }
               ]
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      // const perfStats = await MongoPerformanceHelper.checkAggregationPerformance(this.eventModel, pipeline);
      // console.log(perfStats);

      const events = result[0]?.events ?? [];
      const total = result[0]?.totalCount?.[0]?.total ?? 0;

      return { events, total };
   }


   async publishEvent(eventId: string, organizerId: string) {
      return await this.eventModel.findOneAndUpdate(
         {
            _id: eventId,
            organizerId: organizerId,
            status: 'draft'
         },
         { $set: { status: 'published' } },
         { new: true }
      );
   }


   async cancelEvent(eventId: string, organizerId: string) {
      return await this.eventModel.findOneAndUpdate(
         {
            _id: eventId,
            organizerId: organizerId,
            status: { $in: ['draft', 'published'] }
         },
         { $set: { status: 'cancelled' } },
         { new: true }
      );
   }


   async deleteEvent(eventId: string, organizerId: string) {
      return await this.eventModel.findOneAndUpdate(
         {
            _id: eventId,
            organizerId: organizerId,
            isDeleted: false
         },
         {
            $set: {
               isDeleted: true,
               deletedAt: new Date()
            }
         },
         { new: true }
      );
   }


   async recoverDeleteEvent(eventId: string, organizerId: string) {
      return await this.eventModel.findOneAndUpdate(
         {
            _id: eventId,
            organizerId: organizerId,
            isDeleted: true
         },
         {
            $set: {
               isDeleted: false,
               deletedAt: null
            }
         },
         { new: true }
      );
   }


   // export services
   async findEventById(id: string) {
      return await this.eventModel.findById(id);
   }

   async findEventOwner(eventId: string) {
      const result = await this.eventModel.aggregate([
         {
            $match: { _id: new Types.ObjectId(eventId) },
         },
         {
            $project: { organizerId: 1 },
         },
      ]);

      return result[0] || null;
   }
}