import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdempotencyService } from './idempotency.service';
import { ProcessedMessage, ProcessedMessageSchema } from './idempotency.schema';


@Module({
   imports: [
      MongooseModule.forFeature([{
         name: ProcessedMessage.name,
         schema: ProcessedMessageSchema
      }])
   ],
   providers: [IdempotencyService],
   exports: [IdempotencyService],
})

export class IdempotencyModule { }