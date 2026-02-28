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
   private readonly logger = new Logger(GlobalExceptionFilter.name);

   catch(exception: any, host: ArgumentsHost) {

      // ✅ handle non-HTTP contexts (RabbitMQ, WebSocket, gRPC etc)
      if (host.getType() !== 'http') {
         this.logger.error(`Non-HTTP exception: ${exception.message}`, exception.stack);
         return;
      }

      // existing HTTP handling
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';

      if (exception instanceof HttpException) {
         status = exception.getStatus();
         const res = exception.getResponse();
         message = typeof res === 'object' ? (res as any).message : res;
      } else if (exception instanceof Error) {
         message = exception.message;
      }

      response.status(status).json({
         success: false,
         statusCode: status,
         path: request.url,
         message,
      });
   }
}