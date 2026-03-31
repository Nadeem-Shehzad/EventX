import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { MyRedisModule } from "src/redis/redis.module";
import { AuthHelper } from "./helpers/auth.helper";


@Module({
   imports: [

      forwardRef(() => UserModule),

      JwtModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET'),
            signOptions: {
               expiresIn: Number(config.get('JWT_EXPIRES') ?? 7200)
            }
         })
      }),

      MailerModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            transport: {
               host: config.get<string>('mail_host'),
               port: config.get<number>('mail_port'),
               secure: false,
               auth: {
                  user: config.get<string>('mail_user'),
                  pass: config.get<string>('mail_password')
               }
            },
            defaults: {
               from: '"EventX" <no-reply@eventx.com>',
            },
         })
      }),

      MyRedisModule
   ],
   controllers: [AuthController],
   providers: [AuthService, AuthHelper]
})

export class AuthModule { }