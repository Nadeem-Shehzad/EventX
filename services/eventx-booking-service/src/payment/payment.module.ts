import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { BookingModule } from 'src/modules/booking/booking.module';
import { PaymentController } from './payment.controller';
import { CommonModule } from 'src/common/common.module';
import { OutboxModule } from 'src/outbox/outbox.module';
import { PaymentSagaProcessor } from './saga/payment-saga.processor';
import { PaymentSagaService } from './saga/payment-saga.service';
import { BookingPaymentHandler } from './saga/handlers/booking.handler';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
   imports: [
      StripeModule,
      forwardRef(() => BookingModule),
      LoggingModule,
      OutboxModule,
      CommonModule
   ],
   controllers: [PaymentController],
   providers: [
      PaymentService,
      PaymentSagaProcessor,
      PaymentSagaService,
      BookingPaymentHandler
   ],
   exports: [PaymentService],
})
export class PaymentModule { }
