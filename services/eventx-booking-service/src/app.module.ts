import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import stripeConfig from './config/stripe.config'
import serviceConfig from './config/service.config';
import { validationSchema } from './config/validation.schema';
import { CommonModule } from './common/common.module';
import { MyRedisModule } from './redis/redis.module';
import redisConfig from './config/redis.config';
import { RateLimitModule } from './rateLimit/rate-limit.module';
import { QueuesModule } from './queue/queues.module';
import { DB_QUERY_TIMEOUTS } from './constants/db-timeout.constants';
import { BookingModule } from './modules/booking/booking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './modules/payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingModule } from './logging/logging.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { RabbitMQConfigModule } from './rabbitmq/rabbitmq-config.module';
import { RequestIdMiddleware } from './common/logger/middleware/request-id.middleware';


const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        redisConfig,
        cloudinaryConfig,
        stripeConfig,
        serviceConfig
      ],
      validationSchema
    }),
    
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('BOOKING_MONGO_URI'),
        serverSelectionTimeoutMS: 30000, // ⏱️ how long to wait to find a Mongo server
        socketTimeoutMS: DB_QUERY_TIMEOUTS.defaultSocketTimeoutMS,  // ⏱️ inactivity timeout for queries
        connectTimeoutMS: 20000,        // ⏱️ initial connection timeout
      })
    }),
    
    CommonModule,
    RabbitMQConfigModule,

    LoggingModule,
    MonitoringModule,

    EventEmitterModule.forRoot(),
    QueuesModule,
    //ImageQueueModule,

    ScheduleModule.forRoot(),


    MyRedisModule,
    RateLimitModule,

    PaymentModule,
    //EventModule,
    BookingModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}


// <-------- VIP - apply 'compression' when implementing these modules -------->
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(compression())
//       .forRoutes(
//         'events',
//         'users',
//         'products',
//         'analytics',
//       );
//   }
// }