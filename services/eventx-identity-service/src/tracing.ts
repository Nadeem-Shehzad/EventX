import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';


const traceExporter = new OTLPTraceExporter({
   url: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
});

export const otelSDK = new NodeSDK({
   resource: resourceFromAttributes({
      'service.name': 'identity-service',
      'service.version': '1.0.0',
   }),
   traceExporter,
   instrumentations: [
      getNodeAutoInstrumentations({
         '@opentelemetry/instrumentation-fs': { enabled: false },
         '@opentelemetry/instrumentation-express': { enabled: false },
         '@opentelemetry/instrumentation-net': { enabled: false },
         '@opentelemetry/instrumentation-dns': { enabled: false },
         '@opentelemetry/instrumentation-pino':    { enabled: false },
      }),
   ],
});

process.on('SIGTERM', () => {
   otelSDK.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.error('Error terminating tracing', error))
      .finally(() => process.exit(0));
});