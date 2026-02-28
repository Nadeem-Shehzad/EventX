import {
   Controller, Post, Req, Res,
   Headers, Param, UseGuards,
   HttpCode, HttpStatus
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';


@Controller({ path: 'payments', version: '1' })
export class PaymentController {

   constructor(private readonly paymentService: PaymentService) { }


   @Post('test-payment/:id')
   async testPayment(@Param('id') paymentIntentId: string) {
      return this.paymentService.testPayment(paymentIntentId);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('refund-booking/:id')
   @HttpCode(HttpStatus.OK)
   refundBookingPayment(@Param('id') bookingId: string) {
      return this.paymentService.refundBookingPayment(bookingId);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('refund-event/:id')
   @HttpCode(HttpStatus.OK)
   refundEventPayment(@Param('id') eventId: string) {
      return this.paymentService.refundEventPayment(eventId);
   }


   @Post('webhook')
   async stripeWebhook(
      @Req() req: Request & { rawBody: Buffer },
      @Res() res: Response,
      @Headers('stripe-signature') signature: string,
   ) {
      try {

         // const event = this.stripeService.constructEvent(
         //    req.rawBody,
         //    signature,
         // );

         // await this.paymentService.handleStripeWebhook(event);

         const event: Stripe.Event = req.body;

         await this.paymentService.handleStripeWebhook(event);

         res.status(200).json({ received: true });

      } catch (err) {
         res.status(400).send(`Webhook Error: ${err.message}`);
      }
   }
}
