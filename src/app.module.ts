import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { validationSchema } from './config/validation.schema';
import { CommonModule } from './common/common.module';
import { MyRedisModule } from './redis/redis.module';
import redisConfig from './config/redis.config';
import { RateLimitModule } from './rateLimit/rate-limit.module';
import { LoggerModule } from 'nestjs-pino';
import { EventModule } from './modules/event/event.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig],
      validationSchema
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'req,pid,hostname,context',
            messageFormat: '[{context}] {msg}',
          },
        },
      },
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI')
      })
    }),

    MyRedisModule,
    RateLimitModule,

    AuthModule,
    EventModule,
    CommonModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})

export class AppModule { }


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