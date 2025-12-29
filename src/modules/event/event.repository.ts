import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventDocument } from "./event.schema";


@Injectable()
export class EventRespository {
   constructor(@InjectModel('Event') private eventModel: Model<EventDocument>) { }


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
}