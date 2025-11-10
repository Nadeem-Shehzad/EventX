import { 
   Catch, 
   ExceptionFilter, 
   ArgumentsHost, 
   HttpException, 
   HttpStatus 
} from '@nestjs/common';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
   catch(exception: unknown, host: ArgumentsHost) {
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