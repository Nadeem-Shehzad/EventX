import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketTypeDocument = TicketType & Document;

@Schema({ timestamps: true })
export class TicketType {
   @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
   eventId: Types.ObjectId;

   @Prop({ required: true, trim: true })
   name: string;

   @Prop({ required: true, min: 0 })
   totalQuantity: number;

   @Prop({ required: true, min: 0 })
   availableQuantity: number;

   @Prop({ default: 0, min: 0 })
   reservedQuantity: number;

   @Prop({ default: 0, min: 0 })
   soldQuantity: number;

   @Prop({ required: true, min: 0 })
   price: number;

   @Prop({ required: true })
   currency: string;

   @Prop({ default: true })
   isPaidEvent: boolean;

   @Prop({ default: true })
   isActive: boolean;
}

export const TicketTypeSchema = SchemaFactory.createForClass(TicketType);

// Indexes
TicketTypeSchema.index({ eventId: 1, name: 1 }, { unique: true });
TicketTypeSchema.index({ availableQuantity: 1 });