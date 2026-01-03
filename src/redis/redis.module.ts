import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { REDIS_TIMEOUTS } from 'src/constants/redis-timeout.constants';

@Module({
   imports: [
      //ConfigModule,
      RedisModule.forRoot({
         type: 'single',
         url: 'redis://localhost:6379', 
         options: {
            maxRetriesPerRequest: 3,
            connectTimeout: 10000,      
            commandTimeout: REDIS_TIMEOUTS.defaultCommandTimeout,       
            enableReadyCheck: true,
         },
      }),
   ],
   providers: [RedisService],
   exports: [RedisService]
})

export class MyRedisModule { }