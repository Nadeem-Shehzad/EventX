import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import redisConfig from './config/redis.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import serviceConfig from './config/service.config';
import { CommonModule } from './common/common.module';
import { RequestIdMiddleware } from './common/logger/middleware/request-id.middleware';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsModule } from './metrics/metrics.module';


@Module({
   imports: [

      PrometheusModule.register({
         path: '/metrics',
         defaultMetrics: {
            enabled: true
         },
         global: true 
      }),

      MetricsModule,

      ConfigModule.forRoot({
         isGlobal: true,
         load: [authConfig, cloudinaryConfig, redisConfig, serviceConfig],
         validationSchema,
      }),

      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('IDENTITY_MONGO_URI'),
         }),
      }),

      CommonModule,
      AuthModule,
      UserModule
   ],
})

export class AppModule {}