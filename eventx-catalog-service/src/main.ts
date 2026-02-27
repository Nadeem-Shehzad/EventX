import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corsConfig } from './config/cors.config';
import helmet from 'helmet';
import compression from 'compression';


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
   await app.listen(process.env.PORT ?? 3003);
   console.log(`Server Running on PORT ::: ${process.env.PORT}`);
   //app.useLogger(app.get(Logger));
}

bootstrap();