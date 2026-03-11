// payment.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Payment } from './payment.schema';
import { PaymentStatus } from 'src/constants/payment-status.enum';


@Injectable()
export class PaymentRepository {

   constructor(
      @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>
   ) { }


   async create(data: {
      userId: Types.ObjectId;
      bookingId: Types.ObjectId;
      stripePaymentIntentId: string;
      amount: number;
      currency: string;
      status: PaymentStatus;
   }, session?: ClientSession) {
      const payment = new this.paymentModel(data);
      return await payment.save({ session });
   }


   async findOne(query: {
      bookingId?: Types.ObjectId;
      stripePaymentIntentId?: string;
      status?: { $in: PaymentStatus[] };
   }) {
      return await this.paymentModel.findOne(query);
   }


   async findByPaymentIntentId(stripePaymentIntentId: string) {
      return await this.paymentModel.findOne({ stripePaymentIntentId });
   }

}