import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IdentityClient } from './identity.client';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            baseURL: config.get<string>('IDENTITY_SERVICE_URL'),
            timeout: 5000,
         }),
      }),
   ],
   providers: [IdentityClient],
   exports: [IdentityClient],
})
export class IdentityModule { }