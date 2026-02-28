import { Injectable } from "@nestjs/common";
import { ClientSession } from "mongoose";
import { EventOutboxRepo } from "./event-outbox-repo";


@Injectable()
export class EventOutboxService {

   constructor(private readonly outboxRepo: EventOutboxRepo) { }

   async addEvent<TPayload extends Record<string, any>>(
      aggregateType: string,
      aggregateId: string,
      eventType: string,
      payload: TPayload,
      session?: ClientSession
   ) {
      return this.outboxRepo.addEvent(
         aggregateType,
         aggregateId,
         eventType,
         payload,
         session
      );
   }

   async markPublished(eventId: string) {
      return this.outboxRepo.markPublished(eventId);
   }

   async markFailed(eventId: string, error: string) {
      return this.outboxRepo.markFailed(eventId, error);
   }

   getModel() {
      return this.outboxRepo.getModel();
   }
}