import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private logger;
    catch(exception: any, host: ArgumentsHost): void;
}
