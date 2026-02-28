import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   collection: 'processed_messages',
   timestamps: true,
   expireAfterSeconds: 60 * 60 * 24 * 7 // auto delete after 7 days
})
export class ProcessedMessage extends Document {
   @Prop({ required: true, unique: true, index: true })
   messageId: string;

   @Prop({ required: true })
   bookingId: string;

   @Prop({ required: true })
   email: string;

   @Prop({ default: Date.now, expires: 60 * 60 * 24 * 7 })
   processedAt: Date;
}

export const ProcessedMessageSchema = SchemaFactory.createForClass(ProcessedMessage);