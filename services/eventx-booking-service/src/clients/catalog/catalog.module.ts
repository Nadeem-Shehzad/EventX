import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventClient } from './event.client';


@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            baseURL: config.get<string>('CATALOG_SERVICE_URL'),
            timeout: 5000
         })
      })
   ],
   providers: [EventClient],
   exports: [EventClient]
})

export class EventClientModule { }