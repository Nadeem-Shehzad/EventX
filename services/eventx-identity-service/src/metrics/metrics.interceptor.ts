import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler) {
      return next.handle().pipe(
         tap(() => {
            // keeping empty for now (since you only want login metric)
         }),
      );
   }
}