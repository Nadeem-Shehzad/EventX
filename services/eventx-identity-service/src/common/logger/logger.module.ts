import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';
import { trace } from '@opentelemetry/api';
import path from 'path';
import { randomUUID } from 'crypto';


@Module({
   imports: [
      PinoLoggerModule.forRoot({
         // bind trace_id at request start using pino-http's onReqBindings hook
         pinoHttp: {
            level: process.env.LOG_LEVEL || 'info',
            base: { service: process.env.SERVICE_NAME },
            timestamp: () => `,"time":"${new Date().toISOString()}"`,

            genReqId: (req) => (req.headers['x-request-id'] as string) ?? randomUUID(),

            autoLogging: {
               ignore: (req) => req.url === '/v1/metrics',
            },

            // ✅ fires once per request, before any child spans are created
            customProps: (req, res) => {
               // at request time — store it on req
               if (!(req as any)._traceContext) {
                  const span = trace.getActiveSpan();
                  if (span?.isRecording()) {
                     const { traceId, spanId } = span.spanContext();
                     (req as any)._traceContext = { trace_id: traceId, span_id: spanId };
                  }
               }

               // always return from the stored snapshot — never drift to child spans
               return (req as any)._traceContext ?? {};
            },

            serializers: {
               req: (req) => ({
                  id: req.id,
                  method: req.method,
                  url: req.url,
               }),
               res: (res) => ({
                  statusCode: res.statusCode,
               }),
            },

            ...(process.env.DOCKER !== 'true' && {
               transport: {
                  target: 'pino/file',
                  options: {
                     destination: path.join(process.cwd(), 'logs', `${process.env.SERVICE_NAME}.log`),
                     mkdir: true,
                  },
               },
            }),
         },
      }),
   ],
   providers: [LoggerService],
   exports: [LoggerService],   // ← export your wrapper, not PinoLogger directly
})

export class LoggerModule { }