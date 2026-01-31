import { Injectable } from "@nestjs/common";
import { OutboxRepo } from "./outbox.repo";
import { ClientSession } from "mongoose";


@Injectable()
export class OutboxService {

   constructor(private readonly outboxRepo: OutboxRepo) { }

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

   async findPending() {
      return await this.outboxRepo.findPending();
   }

   async markDispatched(id: string) {
      return await this.outboxRepo.markDispatched(id);
   }

   async markPublished(id: string) {
      return await this.outboxRepo.markPublished(id);
   }
}