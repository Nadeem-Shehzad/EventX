import { Injectable } from '@nestjs/common';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { RequestContextService } from './request-context.service';

@Injectable()
export class LoggerService {
   private logger;

   constructor(private readonly context: RequestContextService) {
      const isDocker = process.env.DOCKER === 'true';

      let transport: any = undefined;

      if (!isDocker) {
         const logDir = path.join(process.cwd(), 'logs');

         if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
         }

         const logPath = path.join(logDir, `${process.env.SERVICE_NAME}.log`);

         transport = pino.destination({
            dest: logPath,
            sync: false,
         });
      }

      this.logger = pino(
         {
            level: process.env.LOG_LEVEL || 'info',
            base: {
               service: process.env.SERVICE_NAME,
            },
            timestamp: pino.stdTimeFunctions.isoTime,

            mixin: () => ({
               requestId: this.context.getRequestId(),
            }),
         },
         transport
      );
   }

   info(message: string, data?: any) {
      this.logger.info(data || {}, message);
   }

   error(message: string, data?: any) {
      this.logger.error(data || {}, message);
   }

   warn(message: string, data?: any) {
      this.logger.warn(data || {}, message);
   }

   debug(message: string, data?: any) {
      this.logger.debug(data || {}, message);
   }
}