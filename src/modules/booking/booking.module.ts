import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "./schema/booking.schema";
import { BookingRepository } from "./repository/booking.repository";
import { CommonModule } from "src/common/common.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
      CommonModule
   ],
   controllers: [BookingController],
   providers: [BookingService, BookingRepository]
})

export class BookingModule { }