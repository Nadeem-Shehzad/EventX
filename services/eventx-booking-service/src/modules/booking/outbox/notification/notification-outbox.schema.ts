import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum NotificationOutboxStatus {
   PENDING = 'PENDING',
   PUBLISHED = 'PUBLISHED',
   FAILED = 'FAILED'
}

export type NotificationOutboxDocument = NotificationOutbox & Document;

@Schema({ timestamps: true })
export class NotificationOutbox extends Document {
   @Prop({ required: true })
   aggregateType: string; // 'Booking'

   @Prop({ required: true })
   aggregateId: string; // bookingId

   @Prop({ required: true })
   eventType: string; // 'booking.confirmed'

   @Prop({ type: Object, required: true })
   payload: Record<string, any>;

   @Prop({ enum: NotificationOutboxStatus, default: NotificationOutboxStatus.PENDING })
   status: NotificationOutboxStatus;

   @Prop({ default: 0 })
   retryCount: number;

   @Prop()
   lastError: string;

   @Prop()
   publishedAt: Date;
}

export const NotificationOutboxSchema = SchemaFactory.createForClass(NotificationOutbox);