import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {

   constructor(
      @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
      private readonly configService: ConfigService
   ) { }


   async createPaymentIntent(params: {
      amount: number;
      currency: string;
      metadata?: Record<string, string>;
   }) {

      return this.stripe.paymentIntents.create({
         amount: params.amount,
         currency: params.currency,
         payment_method_types: ['card'],
         metadata: params.metadata
      });
   }


   // 2️⃣ Backend-only test: confirm PaymentIntent using dummy card
   async confirmTestPayment(paymentIntentId: string) {
      // 1️⃣ Create test payment method
      const paymentMethod = await this.stripe.paymentMethods.create({
         type: 'card',
         card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2030,
            cvc: '123',
         },
      });

      // 2️⃣ Confirm payment intent
      const paymentIntent = await this.stripe.paymentIntents.confirm(
         paymentIntentId,
         {
            payment_method: paymentMethod.id,
         },
      );

      return paymentIntent;
   }


   // constructEvent(payload: Buffer, signature: string) {

   //    const STRIPE_WEBHOOK_SECRET = this.configService.getOrThrow<string>('stripe.webhookKey');

   //    return this.stripe.webhooks.constructEvent(
   //       payload,
   //       signature,
   //       STRIPE_WEBHOOK_SECRET,
   //    );
   // }


   async retrievePaymentIntent(paymentIntentId: string) {
      return this.stripe.paymentIntents.retrieve(paymentIntentId);
   }

}