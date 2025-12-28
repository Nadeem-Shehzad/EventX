import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventDocument } from "./event.schema";
import { CreateEventDTO } from "./dto/create-event.dto";


@Injectable()
export class EventRespository {
   constructor(@InjectModel('Event') private eventModel: Model<EventDocument>) { }

   async create(data: CreateEventDTO): Promise<EventDocument | null> {
      return await this.eventModel.create(data);
   }

   async getEvents() {
      const events = await this.eventModel.find({}).lean();

      return events.map(event => ({
         ...event,
         _id: event._id.toString(),
      }));
   }
}