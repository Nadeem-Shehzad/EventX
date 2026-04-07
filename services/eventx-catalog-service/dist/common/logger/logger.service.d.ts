import { RequestContextService } from './request-context.service';
export declare class LoggerService {
    private readonly context;
    private logger;
    constructor(context: RequestContextService);
    info(message: string, data?: any): void;
    error(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
}
