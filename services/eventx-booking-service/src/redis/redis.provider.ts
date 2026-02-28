// import { Provider } from '@nestjs/common';
// import Redis from 'ioredis';

// export const RedisClient = 'REDIS_CLIENT';

// export const RedisProvider: Provider = {
//    provide: RedisClient,
//    useFactory: async () => {
//       const client = new Redis({
//          host: 'localhost',
//          port: 6379,                 
//          maxRetriesPerRequest: null,
//       });

//       client.on('connect', () => {
//          console.log('✅ Connected to local Redis.');
//       });

//       client.on('error', (err) => {
//          console.error('❌ Redis error:', err);
//       });

//       return client;
//    },
// };