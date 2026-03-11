import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { PaymentStatus } from "src/constants/payment-status.enum";

@Schema({ timestamps: true })
export class Payment {

   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
   userId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, ref: 'Booking', required: true, unique: true })
   bookingId: Types.ObjectId;  // ← unique! one booking = one payment

   @Prop({ required: true })
   stripePaymentIntentId: string; // ← must keep for refunds

   @Prop({ required: true })
   amount: number;

   @Prop({ default: 'PKR' })
   currency: string;

   @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;

   @Prop()
   paidAt?: Date;

   @Prop()
   failureReason?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);