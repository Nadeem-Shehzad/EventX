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
               host: config.get<string>('mail_host'),
               port: config.get<number>('mail_port'),
               secure: false,
               auth: {
                  user: config.get<string>('mail_user'),
                  pass: config.get<string>('mail_password'),
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
