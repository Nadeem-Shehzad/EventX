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
import { QueuesModule } from './queue/queues.module';
import rabbitConfig from './config/rabbit.config';
import { CustomRabbitMQModule } from './rabbitmq/rabbitmq.module';


@Module({
   imports: [

      ConfigModule.forRoot({
         isGlobal: true,
         load: [corsConfig, redisConfig, serviceConfig, rabbitConfig],
         validationSchema,
      }),

      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('TICKET_MONGO_URI'),
         }),
      }),

      CustomRabbitMQModule,
      MyRedisModule,
      QueuesModule,
      TicketModule
   ],
})

export class AppModule { }