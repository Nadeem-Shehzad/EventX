import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { corsConfig } from './config/cors.config';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';


async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
      bufferLogs: false,
      logger: ['error', 'warn'],
   });

   app.use(helmet());
   app.enableCors(corsConfig());
   app.use(compression());

   app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1', 
   });

   app.useGlobalFilters(new GlobalExceptionFilter());
   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
   app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
         enableImplicitConversion: true,
      },
   }));

   await app.listen(process.env.PORT ?? 3000);
   app.useLogger(app.get(Logger));
}

bootstrap();