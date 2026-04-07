import { otelSDK } from './tracing';  

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corsConfig } from './config/cors.config';


async function bootstrap() {

   await otelSDK.start();

   const EventEmitter = require('events');
   EventEmitter.defaultMaxListeners = 20;

   const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: false,
   });

   app.use(helmet());
   app.enableCors(corsConfig());
   app.use(compression());

   app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
   });

   // 🔹 Swagger Configuration
   const config = new DocumentBuilder()
      .setTitle('EventX APIs')
      .setDescription('EventX Backend API Documentation')
      .setVersion('v1')
      .addBearerAuth(
         {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
         },
         'JWT-auth',
      )
      .build();

   const document = SwaggerModule.createDocument(app, config);

   SwaggerModule.setup('docs', app, document);

   app.useGlobalFilters(new GlobalExceptionFilter());

   app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
   );

   app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
         enableImplicitConversion: true,
      },
   }));

   await app.init();
   await app.listen(process.env.PORT ?? 3002);
   console.log(`🚀 identity-service running on port ${process.env.PORT ?? 3002}`);
}

bootstrap();