import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './modules/event/event.module';
import { corsConfig } from './config/cors.config';
import redisConfig from './config/redis.config';
import serviceConfig from './config/service.config';
import { validationSchema } from './config/validation.schema';

@Module({
   imports: [

      ConfigModule.forRoot({
         isGlobal: true,
         load: [corsConfig, redisConfig, serviceConfig],
         validationSchema,
      }),

      GraphQLModule.forRoot<ApolloDriverConfig>({
         driver: ApolloDriver,
         autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
         sortSchema: true,
         playground: true,
         introspection: true,
         context: ({ req, res }) => ({ req, res }),
      }),

      EventModule,
   ],
})

export class AppModule { }