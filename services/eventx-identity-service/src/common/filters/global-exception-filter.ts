import {
   Catch,
   ExceptionFilter,
   ArgumentsHost,
   HttpException,
   HttpStatus,
   Logger
} from '@nestjs/common';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

   private logger = new Logger(GlobalExceptionFilter.name);

   catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let code = 'INTERNAL_ERROR';

      if (exception instanceof HttpException) {
         status = exception.getStatus();
         const res = exception.getResponse();
         message = typeof res === 'string' ? res : (res as any).message;
         code = (res as any).code ?? HttpStatus[status];
      }

      // Log unexpected errors with full stack (not HttpExceptions you threw intentionally)
      if (!(exception instanceof HttpException)) {
         this.logger.error({
            msg: 'Unhandled exception',
            path: request.url,
            method: request.method,
            error: exception instanceof Error ? exception.message : exception,
            stack: exception instanceof Error ? exception.stack : undefined,
         });
      }

      response.status(status).json({
         success: false,
         statusCode: status,
         code,
         message,
         path: request.url,
         timestamp: new Date().toISOString(),
      });
   }
}