// src/logging/logging.service.ts
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

export interface LogOptions {
   module?: string;
   service?: string;
   msg: string;
   bookingId?: string;
   eventId?: string;
   ticketId?: string;
   [key: string]: any; // allow extra metadata
}

@Injectable()
export class AppLogger {
   constructor(private readonly logger: PinoLogger) { }

   info({ module, service, msg, ...meta }: LogOptions) {
      this.logger.info({ module, service, ...meta }, msg);
   }

   warn({ module, service, msg, ...meta }: LogOptions) {
      this.logger.warn({ module, service, ...meta }, msg);
   }

   error({ module, service, msg, ...meta }: LogOptions) {
      this.logger.error({ module, service, ...meta }, msg);
   }

   debug({ module, service, msg, ...meta }: LogOptions) {
      this.logger.debug({ module, service, ...meta }, msg);
   }
}