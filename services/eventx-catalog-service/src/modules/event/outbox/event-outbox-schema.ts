import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum EventOutboxStatus {
   PENDING = 'PENDING',
   PUBLISHED = 'PUBLISHED',
   FAILED = 'FAILED'
}

export type EventOutboxDocument = EventOutbox & Document;

@Schema({ timestamps: true })
export class EventOutbox extends Document {
   @Prop({ required: true })
   aggregateType: string; // 'Booking'

   @Prop({ required: true })
   aggregateId: string; // bookingId

   @Prop({ required: true })
   eventType: string; // 'booking.confirmed'

   @Prop({ type: Object, required: true })
   payload: Record<string, any>;

   @Prop({ enum: EventOutboxStatus, default: EventOutboxStatus.PENDING })
   status: EventOutboxStatus;

   @Prop({ default: 0 })
   retryCount: number;

   @Prop()
   lastError: string;

   @Prop()
   publishedAt: Date;
}

export const EventOutboxSchema = SchemaFactory.createForClass(EventOutbox);