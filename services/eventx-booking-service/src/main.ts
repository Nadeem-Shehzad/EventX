import * as dotenv from 'dotenv';
dotenv.config();

process.on('uncaughtException', (error) => {
   console.error('UNCAUGHT EXCEPTION:', error);
   process.exit(1);
});

process.on('unhandledRejection', (reason) => {
   console.error('UNHANDLED REJECTION:', reason);
   process.exit(1);
});

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { corsConfig } from './config/cors.config';
import { VersioningType } from '@nestjs/common';
import bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
   try {
      const app = await NestFactory.create(AppModule, {
         bufferLogs: true,
         logger: ['error', 'warn', 'log'],
      });

      app.use(helmet());
      app.enableCors(corsConfig());
      app.use(compression());

      app.enableVersioning({
         type: VersioningType.URI,
         defaultVersion: '1',
      });

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

      app.use(
         '/payments/webhook',
         bodyParser.raw({ type: 'application/json' }),
      );

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

      await app.listen(process.env.PORT ?? 3000);
      console.log(`booking-service running on PORT ${process.env.PORT ?? 3000}`);

   } catch (error) {
      console.error('Bootstrap failed:', error);  // ← this will show the real error
      process.exit(1);
   }
}

bootstrap();