import { forwardRef, Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "./schema/booking.schema";
import { BookingRepository } from "./repository/booking.repository";
import { CommonModule } from "src/common/common.module";
import { EventModule } from "../event/event.module";
import { PaymentModule } from "src/payment/payment.module";
import { MyRedisModule } from "src/redis/redis.module";
import { BookingCacheListener } from "./listeners/booking-cache-listener";
import { UserModule } from "../user/user.module";
import { BookingEmailListener } from "./listeners/booking-email-listener";
import { EmailQueueModule } from "src/queue/email/email.queue.module";
import { OutboxModule } from "src/outbox/outbox.module";
import { BookingSagaProcessor } from "./saga/booking-saga.processor";
import { BookingSagaService } from "./saga/booking-saga.service";
import { TicketsBookingHandler } from "./saga/handlers/ticket.handler";
import { BookingsHandler } from "./saga/handlers/booking.handler";
import { LoggingModule } from "src/logging/logging.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
      LoggingModule,
      UserModule,
      EventModule,
      OutboxModule,
      forwardRef(() => PaymentModule),
      CommonModule,
      MyRedisModule,
      EmailQueueModule
   ],
   controllers: [BookingController],
   providers: [
      BookingService, 
      BookingRepository, 
      BookingCacheListener, 
      BookingEmailListener,
      BookingSagaProcessor,
      BookingSagaService,
      TicketsBookingHandler,
      BookingsHandler
   ],
   exports: [BookingService]
})

export class BookingModule { }