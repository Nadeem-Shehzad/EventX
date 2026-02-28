import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventOutbox, EventOutboxSchema } from "./event-outbox-schema";
import { EventOutboxRepo } from "./event-outbox-repo";
import { EventOutboxService } from "./event-outbox.service";
import { EventOutboxProcessor } from "./event-outbox-processor";


@Module({
   imports: [
      MongooseModule.forFeature([{
         name: EventOutbox.name,
         schema: EventOutboxSchema
      }]),
   ],
   providers: [
      EventOutboxService,
      EventOutboxRepo,
      ...(process.env.NODE_ENV === 'test'
         ? []
         : [EventOutboxProcessor]),
   ],
   exports: [EventOutboxService]
})

export class EventOutboxModule { }