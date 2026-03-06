import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { BookingClient } from "./booking.client";


@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            baseURL: config.get<string>('BOOKING_SERVICE_URL'),
            timeout: 5000
         })
      })
   ],
   providers: [BookingClient],
   exports: [BookingClient]
})

export class BookingClientModule { }