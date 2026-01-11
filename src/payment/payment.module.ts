import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { BookingModule } from 'src/modules/booking/booking.module';

@Module({
   imports: [
      StripeModule,
      forwardRef(() => BookingModule)
   ],
   providers: [PaymentService],
   exports: [PaymentService],
})
export class PaymentModule { }
