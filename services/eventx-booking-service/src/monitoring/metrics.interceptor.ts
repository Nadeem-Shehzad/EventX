import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler) {
      const start = Date.now();

      return next.handle().pipe(
         tap(() => {
            const duration = Date.now() - start;
            // record duration metric
         }),
      );
   }
}
