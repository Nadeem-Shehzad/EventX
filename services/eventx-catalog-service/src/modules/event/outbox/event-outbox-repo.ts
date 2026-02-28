import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { EventOutbox, EventOutboxDocument, EventOutboxStatus } from "./event-outbox-schema";



@Injectable()
export class EventOutboxRepo {

   constructor(
      @InjectModel(EventOutbox.name)
      private readonly outboxModel: Model<EventOutboxDocument>
   ) { }

   async addEvent(
      aggregateType: string,
      aggregateId: string,
      eventType: string,
      payload: Record<string, any>,
      session?: ClientSession
   ) {
      return this.outboxModel.create([{
         aggregateType,
         aggregateId,
         eventType,
         payload,
         status: EventOutboxStatus.PENDING
      }], { session });
   }

   async markPublished(eventId: string) {
      return this.outboxModel.updateOne(
         { _id: eventId },
         {
            $set: {
               status: EventOutboxStatus.PUBLISHED,
               publishedAt: new Date()
            }
         }
      );
   }

   async markFailed(eventId: string, error: string) {
      return this.outboxModel.updateOne(
         { _id: eventId },
         {
            $set: { status: EventOutboxStatus.FAILED, lastError: error },
            $inc: { retryCount: 1 }
         }
      );
   }

   getModel() {
      return this.outboxModel;
   }
}