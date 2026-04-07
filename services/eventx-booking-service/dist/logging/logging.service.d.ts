import { PinoLogger } from 'nestjs-pino';
export interface LogOptions {
    module?: string;
    service?: string;
    msg: string;
    bookingId?: string;
    eventId?: string;
    ticketId?: string;
    [key: string]: any;
}
export declare class AppLogger {
    private readonly logger;
    constructor(logger: PinoLogger);
    info({ module, service, msg, ...meta }: LogOptions): void;
    warn({ module, service, msg, ...meta }: LogOptions): void;
    error({ module, service, msg, ...meta }: LogOptions): void;
    debug({ module, service, msg, ...meta }: LogOptions): void;
}
