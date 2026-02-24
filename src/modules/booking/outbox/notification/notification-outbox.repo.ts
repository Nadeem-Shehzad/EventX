import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import {
   NotificationOutbox,
   NotificationOutboxDocument,
   NotificationOutboxStatus
} from "./notification-outbox.schema";


@Injectable()
export class NotificationOutboxRepo {

   constructor(
      @InjectModel(NotificationOutbox.name)
      private readonly outboxModel: Model<NotificationOutboxDocument>
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
         status: NotificationOutboxStatus.PENDING
      }], { session });
   }

   async markPublished(eventId: string) {
      return this.outboxModel.updateOne(
         { _id: eventId },
         {
            $set: {
               status: NotificationOutboxStatus.PUBLISHED,
               publishedAt: new Date()
            }
         }
      );
   }

   async markFailed(eventId: string, error: string) {
      return this.outboxModel.updateOne(
         { _id: eventId },
         {
            $set: { status: NotificationOutboxStatus.FAILED, lastError: error },
            $inc: { retryCount: 1 }
         }
      );
   }

   getModel() {
      return this.outboxModel;
   }
}