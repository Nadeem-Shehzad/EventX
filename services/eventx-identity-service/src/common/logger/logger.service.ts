import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';


@Injectable()
export class LoggerService {
   constructor(private readonly logger: PinoLogger) {
      this.logger.setContext('App'); // default context, override per-class
   }

   info(message: string, data?: object) {
      this.logger.info(data ?? {}, message);
   }

   error(message: string, data?: object) {
      this.logger.error(data ?? {}, message);
   }

   warn(message: string, data?: object) {
      this.logger.warn(data ?? {}, message);
   }

   debug(message: string, data?: object) {
      this.logger.debug(data ?? {}, message);
   }
}