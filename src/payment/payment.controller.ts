import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from 'src/stripe/stripe.service';

@Controller('payments')
export class PaymentController {

   constructor(
      private readonly paymentService: PaymentService,
      private readonly stripeService: StripeService
   ) { }


   // @Post('webhook')
   // async stripeWebhook(
   //    @Req() req: Request & { rawBody: Buffer },
   //    @Res() res: Response,
   //    @Headers('stripe-signature') signature: string,
   // ) {
   //    try {
   //       const event = this.stripeService.constructEvent(
   //          req.rawBody,
   //          signature,
   //       );

   //       await this.paymentService.handleStripeWebhook(event);
   //       res.status(200).json({ received: true });
   //    } catch (err) {
   //       res.status(400).send(`Webhook Error: ${err.message}`);
   //    }
   // }
}
