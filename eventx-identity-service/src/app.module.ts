import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import redisConfig from './config/redis.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import serviceConfig from './config/service.config';


@Module({
   imports: [

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

      AuthModule,
      UserModule
   ],
})

export class AppModule { }