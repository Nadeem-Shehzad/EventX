import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { BookingModule } from 'src/modules/booking/booking.module';
import { PaymentController } from './payment.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
   imports: [
      StripeModule,
      forwardRef(() => BookingModule),
      CommonModule
   ],
   controllers: [PaymentController],
   providers: [PaymentService],
   exports: [PaymentService],
})
export class PaymentModule { }
