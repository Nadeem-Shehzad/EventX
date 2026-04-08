import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";
import { SpanStatusCode, trace } from "@opentelemetry/api";


@Injectable()
export class OpenTelemetryInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const tracer = trace.getTracer('default');

      // Fallback to URL if the exact route pattern isn't available yet
      const routeName = req.route ? req.route.path : req.url;
      const spanName = `${req.method} ${routeName}`;

      return tracer.startActiveSpan(spanName, (span) => {
         span.setAttributes({
            'http.method': req.method,
            'http.url': req.url,
            'route': routeName,
         });

         // Optional: If you have a JWT guard that attaches user info, grab it!
         if (req.user && req.user.id) {
            span.setAttribute('user.id', req.user.id);
         }

         return next.handle().pipe(
            // 3. 'tap' runs when the API successfully finishes (like the end of a try block)
            tap(() => {
               span.setStatus({ code: SpanStatusCode.OK });
               span.end();
            }),
            // 4. 'catchError' runs if your code throws an exception (like a catch block)
            catchError((error) => {
               span.recordException(error);
               span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
               span.end();
               throw error; // Re-throw so NestJS can return the 500 error
            }),
         );
      });
   }
}