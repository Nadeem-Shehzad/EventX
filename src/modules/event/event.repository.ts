import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, PipelineStage, Types } from "mongoose";
import { EventDocument } from "./schema/event.schema";
import { MongoPerformanceHelper } from "src/common/helpers/db-performance-checker";
import { EventType } from "./enums/event.enums";
import { UpdateEventDTO } from "./dto/request/update-event.dto";
import { CreateEventDTO } from "./dto/request/create-event.dto";


@Injectable()
export class EventRespository {

   constructor(
      @InjectModel('Event') private eventModel: Model<EventDocument>,
   ) { }

   private readonly logger = new Logger(EventRespository.name);


   async create(data: any, dto: CreateEventDTO, session: ClientSession) {
      const event = await this.eventModel.create([data], { session, ordered: true });
      return event[0];
   }


   async updateEvent(id: string, dataToUpdate: UpdateEventDTO, session: ClientSession) {

      const event = await this.eventModel.findOneAndUpdate(
         { _id: id },
         { $set: dataToUpdate },
         { new: true, session }
      );

      if (!event) {
         throw new Error('Event not found');
      }

      return event;
   }


   async getEvents() {
      const events = await this.eventModel.find({}).lean();

      return events.map(event => ({
         ...event,
         _id: event._id.toString(),
      }));
   }


   async getEventsByAggregation(page = 1, limit = 10) {

      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [

         {
            $match: {
               status: 'published',
               isDeleted: false,
            },
         },

         { $sort: { startDateTime: 1 } },

         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },

                  {
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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
                  {
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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
               organizerId: new Types.ObjectId(id),
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
                     $lookup: {
                        from: 'users',
                        localField: 'organizerId', // Matches ObjectId to ObjectId directly
                        foreignField: '_id',
                        pipeline: [
                           { $project: { name: 1 } } // Only fetch the name
                        ],
                        as: 'organizer'
                     }
                  },
                  // {
                  //    $lookup: {
                  //       from: 'users',
                  //       let: { organizerId: { $toObjectId: '$organizerId' } },
                  //       pipeline: [
                  //          {
                  //             $match: {
                  //                $expr: {
                  //                   $eq: ['$_id', '$$organizerId']
                  //                }
                  //             }
                  //          },
                  //          {
                  //             $project: {
                  //                name: 1
                  //             }
                  //          }
                  //       ],
                  //       as: 'organizer'
                  //    }
                  // },
                  {
                     $unwind: {
                        path: '$organizer',
                        preserveNullAndEmptyArrays: true
                     }
                  },
                  {
                     $project: administrativeResponseData
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

      this.logger.log(events);

      return { events, total };
   }


   async getOrganizerOwnEvents(id: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const pipeline: PipelineStage[] = [
         {
            $match: {
               organizerId: new Types.ObjectId(id)
            }
         },
         { $sort: { createdAt: -1 } },
         {
            $facet: {
               events: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: publicResponseData
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
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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


   async eventStatusSummary() {

      const pipeline: PipelineStage[] = [
         {
            $match: {
               isDeleted: false
            }
         },
         {
            $group: {
               _id: '$status',
               total: { $sum: 1 }
            }
         },
         {
            $project: {
               _id: 0,
               status: '$_id',
               total: 1
            }
         },
         { $sort: { status: 1 } }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      return result;
   }


   async eventVisibilitySummary() {

      const pipeline: PipelineStage[] = [
         {
            $match: {
               isDeleted: false
            }
         },
         {
            $group: {
               _id: '$visibility',
               total: { $sum: 1 }
            }
         },
         {
            $project: {
               _id: 0,
               visibility: '$_id',
               total: 1
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      return result;
   }


   async eventTagsSummary() {

      const pipeline: PipelineStage[] = [
         {
            $match: {
               isDeleted: false
            }
         },
         { $unwind: '$tags' },
         {
            $group: {
               _id: '$tags',
               total: { $sum: 1 }
            }
         },
         { $sort: { total: 1 } },
         {
            $project: {
               _id: 0,
               tag: '$_id',
               total: 1
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      return result;
   }


   async eventTypeSummary() {

      const pipeline: PipelineStage[] = [
         {
            $match: {
               isDeleted: false
            }
         },
         {
            $group: {
               _id: '$eventType',
               total: { $sum: 1 }
            }
         },
         {
            $sort: { total: 1 }
         },
         {
            $project: {
               _id: 0,
               eventType: '$_id',
               total: 1
            }
         }
      ];

      const result = await this.eventModel.aggregate(pipeline);

      return result;
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
                     $lookup: {
                        from: 'tickettypes',          // MongoDB collection name
                        localField: '_id',            // Event _id
                        foreignField: 'eventId',      // TicketType.eventId
                        as: 'ticketTypes',            // result array field
                     },
                  },

                  {
                     $project: {
                        ...publicResponseData,
                        ticketTypes: {
                           name: 1,
                           totalQuantity: 1,
                           soldQuantity: 1,
                           reservedQuantity: 1,
                           price: 1,
                           currency: 1,
                           isPaidEvent: 1,
                        },
                     },
                  },
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


   async softDeleteEvent(eventId: string, organizerId: string) {
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


   async deleteEventPermanently(eventId: string, organizerId: string, session: ClientSession) {

      const event = await this.eventModel.findOne({ _id: eventId, organizerId, isDeleted: true }).session(session);
      if (!event) throw new NotFoundException('Event not found or not soft-deleted');

      const result = await this.eventModel.findOneAndDelete(
         {
            _id: eventId,
            organizerId: organizerId,
            isDeleted: true
         }
      ).session(session);

      return result;
   }


   async recoverDeletedEvent(eventId: string, organizerId: string) {
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


// helper
export const publicResponseData = {
   _id: { $toString: '$_id' },
   title: 1,
   description: 1,
   category: 1,
   tags: 1,
   eventType: 1,
   location: {
      $cond: [
         { $ne: ['$eventType', EventType.ONLINE] },
         '$location',
         '$$REMOVE'
      ]
   },
   bannerImage: 1,
   startDateTime: 1,
   endDateTime: 1,
   timezone: 1,
   capacity: 1,
   registeredCount: 1,
   isPaid: 1,
   //ticketTypes: 1
}


export const administrativeResponseData = {
   _id: { $toString: '$_id' },
   title: 1,
   description: 1,
   category: 1,
   tags: 1,
   eventType: 1,
   location: {
      $cond: [
         { $ne: ['$eventType', EventType.ONLINE] },
         '$location',
         '$$REMOVE'
      ]
   },
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
   },
   organizer: {
      name: '$organizer.name'
   }
}