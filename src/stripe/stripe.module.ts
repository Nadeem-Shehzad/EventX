import { Module } from '@nestjs/common';
import { STRIPE_CLIENT } from './stripe.constants';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';


@Module({
   providers: [
      {
         provide: STRIPE_CLIENT,
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => {
            return new Stripe(configService.getOrThrow<string>('stripe.secretKey'), {
               apiVersion: '2025-12-15.clover',
            });
         },
      },
      StripeService,
   ],
   exports: [StripeService],
})
export class StripeModule { }
