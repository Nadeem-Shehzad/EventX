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


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
      UserModule,
      EventModule,
      forwardRef(() => PaymentModule),
      CommonModule,
      MyRedisModule,
      EmailQueueModule
   ],
   controllers: [BookingController],
   providers: [BookingService, BookingRepository, BookingCacheListener, BookingEmailListener],
   exports: [BookingService]
})

export class BookingModule { }