import { PinoLogger } from 'nestjs-pino';
export declare class LoggerService {
    private readonly logger;
    constructor(logger: PinoLogger);
    info(message: string, data?: object): void;
    error(message: string, data?: object): void;
    warn(message: string, data?: object): void;
    debug(message: string, data?: object): void;
}
