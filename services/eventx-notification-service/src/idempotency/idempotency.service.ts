import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProcessedMessage } from './idempotency.schema';


@Injectable()
export class IdempotencyService {
   private readonly logger = new Logger(IdempotencyService.name);

   constructor(
      @InjectModel(ProcessedMessage.name)
      private readonly processedMessageModel: Model<ProcessedMessage>
   ) { }

   // returns true → first time, safe to process
   // returns false → duplicate, skip
   async tryMarkAsProcessing(messageId: string, metadata: {
      bookingId: string;
      email: string;
   }): Promise<boolean> {
      try {
         const result = await this.processedMessageModel.collection.findOneAndUpdate(
            { messageId },
            {
               $setOnInsert: {
                  messageId,
                  bookingId: metadata.bookingId,
                  email: metadata.email,
                  processedAt: new Date(),
               }
            },
            {
               upsert: true,
               returnDocument: 'before', // null if newly inserted
            }
         );

         // null → just inserted → first time ✅
         // not null → already exists → duplicate ❌
         return result === null;

      } catch (error) {
         this.logger.error(`Idempotency check failed: ${error.message}`);
         throw error;
      }
   }

   async deleteRecord(messageId: string): Promise<void> {
      await this.processedMessageModel.deleteOne({ messageId });
   }
}