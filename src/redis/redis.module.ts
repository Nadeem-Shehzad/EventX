import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { REDIS_TIMEOUTS } from 'src/constants/redis-timeout.constants';

@Module({
   imports: [
      RedisModule.forRoot({
         type: 'single',
         url: 'redis://localhost:6379',  // redis://localhost:6379 when runs on host machine
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