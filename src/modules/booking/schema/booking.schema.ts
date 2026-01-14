import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from '../enum/booking-status.enum';
import { PaymentStatus } from '../../../constants/payment-status.enum';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking extends Document {
   @Prop({ type: Types.ObjectId, required: true })
   userId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true })
   eventId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true })
   ticketTypeId: Types.ObjectId;

   @Prop({ required: true })
   quantity: number;

   @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
   status: BookingStatus;

   @Prop({ required: true })
   amount: number;

   @Prop({ required: true })
   currency: string;

   @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
   paymentStatus: PaymentStatus;

   @Prop()
   paymentIntentId?: string;


   @Prop({ type: Date, default: null })
   expiresAt?: Date;

   @Prop()
   confirmedAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// TTL index
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Query indexes
BookingSchema.index({ userId: 1, createdAt: -1 }, { partialFilterExpression: { status: "CONFIRMED" } });
BookingSchema.index({ userId: 1, status: 1, createdAt: -1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ eventId: 1, status: 1 });