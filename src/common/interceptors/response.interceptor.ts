import {
   NestInterceptor,
   Injectable,
   CallHandler,
   ExecutionContext
} from "@nestjs/common";
import { map, Observable } from "rxjs";


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

      const response = context.switchToHttp().getResponse();

      return next.handle().pipe(
         map((data) => {
            
            return {
               success: true,
               statusCode: response.statusCode,
               data
            };
         })
      );
   }
}