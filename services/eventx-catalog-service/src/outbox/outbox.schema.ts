import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export enum OutboxStatus {
   PENDING = 'PENDING',
   DISPATCHED = 'DISPATCHED ',
   PUBLISHED = 'PUBLISHED'
}


export type OutboxEventDocument = OutboxEvent & Document;

@Schema({ timestamps: true })
export class OutboxEvent extends Document {
   @Prop({ required: true })
   aggregateType: string;  // Booking

   @Prop({ required: true })
   aggregateId: string; // bookingId

   @Prop({ required: true })
   eventType: string; // BookingCreated

   @Prop({ type: Object, required: true })
   payload: Record<string, any>;

   @Prop({ enum: OutboxStatus, default: OutboxStatus.PENDING })
   status: OutboxStatus
}

export const OutboxSchema = SchemaFactory.createForClass(OutboxEvent);