import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisClient = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
   provide: RedisClient,
   useFactory: async () => {
      const client = new Redis({
         host: 'redis-15448.c82.us-east-1-2.ec2.redns.redis-cloud.com',
         port: 15448,
         username: 'default',
         password: 'a4UjzshlvRi1emtDUyDIGeDdc5cn4Q0R',
         tls: {},                 
         maxRetriesPerRequest: null,
      });

      client.on('connect', () => {
         console.log('✅ Connected to Redis Cloud via TLS.');
      });

      client.on('error', (err) => {
         console.error('❌ Redis error:', err);
      });

      return client;
   },
};