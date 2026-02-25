import { Module } from "@nestjs/common";
import { OutboxDispatcher } from "./outbox.dispatcher";
import { OutboxRepo } from "./outbox.repo";
import { OutboxService } from "./outbox.service";
import { MongooseModule } from "@nestjs/mongoose";
import { OutboxSchema } from "./outbox.schema";
import { EventQueueModule } from "src/queue/event/event.queue.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'OutboxEvent', schema: OutboxSchema }]),
      EventQueueModule
   ],
   providers: [OutboxDispatcher, OutboxRepo, OutboxService],
   exports: [OutboxService]
})

export class OutboxModule { }