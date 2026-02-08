import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { REDIS_TIMEOUTS } from "../constants/redis";
import { ConfigService } from "@nestjs/config";


@Module({
   imports: [
      RedisModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            type: 'single',
            url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
            options: {
               maxRetriesPerRequest: 3,
               connectTimeout: 10000,
               commandTimeout: REDIS_TIMEOUTS.defaultCommandTimeout,
               enableReadyCheck: true,
            }
         })
      })
   ]
})

export class NotificationRedisModule { }