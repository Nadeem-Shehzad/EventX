import { Injectable } from "@nestjs/common";
import { ClientSession } from "mongoose";
import { NotificationOutboxRepo } from "./notification-outbox.repo";


@Injectable()
export class NotificationOutboxService {

   constructor(private readonly outboxRepo: NotificationOutboxRepo) { }

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