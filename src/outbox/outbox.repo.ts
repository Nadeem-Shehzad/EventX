import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { OutboxEventDocument, OutboxStatus } from "./outbox.schema";


export class OutboxRepo {

   constructor(@InjectModel('OutboxEvent') private outboxModel: Model<OutboxEventDocument>) { }


   async addEvent(aggregateType: string, aggregateId: string, eventType: string, payload: any, session?: ClientSession) {

      const eventPayload = {
         aggregateType,
         aggregateId,
         eventType,
         payload
      };

      const event = await this.outboxModel.create([eventPayload], { session });
      return event;
   }


   async findPending() {
      return await this.outboxModel.find({ status: OutboxStatus.PENDING });
   }


   async markDispatched(eventId: string) {
      return this.outboxModel.updateOne(
         { _id: eventId, status: OutboxStatus.PENDING },
         { $set: { status: OutboxStatus.DISPATCHED } }
      );
   }


   async markPublished(eventId: string) {
      return this.outboxModel.updateOne(
         { _id: eventId, status: OutboxStatus.DISPATCHED },
         { $set: { status: OutboxStatus.PUBLISHED } }
      );
   }
}