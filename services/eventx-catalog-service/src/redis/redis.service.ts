import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis } from 'ioredis';


@Injectable()
export class RedisService {
   constructor(@InjectRedis() private readonly redis: Redis) { }

   async set(key: string, value: string, ttl?: number) {
      if (ttl) return this.redis.set(key, value, 'EX', ttl);
      return this.redis.set(key, value);
   }

   async get(key: string) {
      return this.redis.get(key);
   }

   async del(key: string) {
      return this.redis.del(key);
   }

   async decrby(key: string, value: number) {
      return this.redis.decrby(key, value);
   }

   async incrby(key: string, value: number) {
      return this.redis.incrby(key, value);
   }

   pipeline() {
      return this.redis.pipeline();
   }

   async delPattern(pattern: string) {
      const allKeys = await this.redis.keys(pattern);
      if (allKeys.length > 0) {
         await this.redis.del(allKeys);
      }
   }
}