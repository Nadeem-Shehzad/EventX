import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeModule } from '../../stripe/stripe.module';
import { BookingModule } from 'src/modules/booking/booking.module';
import { PaymentController } from './payment.controller';
import { CommonModule } from 'src/common/common.module';
import { OutboxModule } from 'src/outbox/outbox.module';
import { PaymentSagaProcessor } from './saga/payment-saga.processor';
import { PaymentSagaService } from './saga/payment-saga.service';
import { BookingPaymentHandler } from './saga/handlers/booking.handler';
import { LoggingModule } from 'src/logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './payment.schema';
import { PaymentRepository } from './payment.repo';
import { CircuitBreakerService } from 'src/circuit-breaker/circuit-breaker.service';

@Module({
   imports: [

      MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),

      StripeModule,
      forwardRef(() => BookingModule),
      LoggingModule,
      OutboxModule,
   ],
   controllers: [PaymentController],
   providers: [
      PaymentRepository,
      PaymentService,
      PaymentSagaProcessor,
      PaymentSagaService,
      BookingPaymentHandler,
      CircuitBreakerService
   ],
   exports: [PaymentService],
})

export class PaymentModule { }