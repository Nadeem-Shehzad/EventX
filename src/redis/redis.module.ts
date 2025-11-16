import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Module({
   imports: [
      ConfigModule,
      RedisModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            type: 'single',
            url: `redis://${config.get('redis.username')}:${config.get('redis.password')}@${config.get('redis.host')}:${config.get('redis.port')}`,
            options: {
               maxRetriesPerRequest: null
            }
         }),
      })
   ],
   providers: [RedisService], 
   exports: [RedisService]
})

export class MyRedisModule { }