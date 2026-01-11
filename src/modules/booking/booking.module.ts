import { forwardRef, Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "./schema/booking.schema";
import { BookingRepository } from "./repository/booking.repository";
import { CommonModule } from "src/common/common.module";
import { EventModule } from "../event/event.module";
import { PaymentModule } from "src/payment/payment.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
      EventModule,
      forwardRef(() => PaymentModule),
      CommonModule
   ],
   controllers: [BookingController],
   providers: [BookingService, BookingRepository],
   exports: [BookingService]
})

export class BookingModule { }