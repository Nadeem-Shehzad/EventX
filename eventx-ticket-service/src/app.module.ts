import { Module } from '@nestjs/common';
import { TicketModule } from './modules/ticket/ticket.module';
import { LoggingModule } from './logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from './config/redis.config';
import serviceConfig from './config/service.config';
import { validationSchema } from './config/validation.schema';
import { corsConfig } from './config/cors.config';
import { MyRedisModule } from './redis/redis.module';


@Module({
   imports: [

      ConfigModule.forRoot({
         isGlobal: true,
         load: [corsConfig, redisConfig, serviceConfig],
         validationSchema,
      }),

      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('TICKET_MONGO_URI'),
         }),
      }),

      MyRedisModule,
      TicketModule
   ],
})

export class AppModule { }