
import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppLogger } from './logging.service';
import path from 'path';


const isProd = process.env.NODE_ENV === 'production';
const logPath = path.join(process.cwd(), 'logs/app.log');

@Global()
@Module({
   imports: [
      LoggerModule.forRoot({
         pinoHttp: {
            level: 'info',
            autoLogging: false,
            transport: {
               targets: [
                  // Pretty console only in dev
                  ...(!isProd
                     ? [
                        {
                           target: 'pino-pretty',
                           level: 'info',
                           options: {
                              colorize: true,
                              translateTime: 'SYS:standard',
                              ignore: 'pid,hostname,req',
                              messageFormat: '[{context}] {msg}',
                           },
                        },
                     ]
                     : []),

                  // JSON file for Loki (always)
                  {
                     target: 'pino/file',
                     options: {
                        destination: logPath,
                        mkdir: true,
                     },
                  },
               ],
            },
         },
      }),
   ],
   providers: [AppLogger],
   exports: [AppLogger],
})

export class LoggingModule { }