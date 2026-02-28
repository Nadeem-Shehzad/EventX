// mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
   imports: [
      MailerModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            transport: {
               host: config.get<string>('MAIL_HOST'),
               port: config.get<number>('MAIL_PORT'),
               secure: false,
               auth: {
                  user: config.get<string>('MAIL_USER'),
                  pass: config.get<string>('MAIL_PASSWORD'),
               },
            },
            defaults: {
               from: '"EventX" <no-reply@eventx.com>',
            },
         }),
      }),
   ],
   providers: [MailService],
   exports: [MailService],
})
export class MailModule { }
