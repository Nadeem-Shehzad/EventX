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


   async createPaymentIntent(
      params: {
         amount: number;
         currency: string;
         metadata?: Record<string, string>;
      },
      idempotencyKey?: string  // ← add this
   ) {
      return await this.stripe.paymentIntents.create(
         {
            amount: params.amount,
            currency: params.currency,
            payment_method_types: ['card'],
            metadata: params.metadata
         },
         idempotencyKey
            ? { idempotencyKey }
            : undefined
      );
   }


   async confirmTestPayment(paymentIntentId: string) {
      // Use Stripe test token instead of raw card details
      const paymentIntent = await this.stripe.paymentIntents.confirm(
         paymentIntentId,
         {
            payment_method: 'pm_card_visa', // ✅ Stripe test payment method
         },
      );

      return paymentIntent;
   }


   async refundPayment(paymentIntentId: string) {
      return await this.stripe.refunds.create({
         payment_intent: paymentIntentId
      });
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