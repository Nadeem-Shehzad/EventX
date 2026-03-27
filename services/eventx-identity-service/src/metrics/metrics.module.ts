import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { makeCounterProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Global()
@Module({
   providers: [
      MetricsService,
      makeCounterProvider({
         name: 'auth_login_total',
         help: 'Total login attempts',
         labelNames: ['status'],
      }),
      makeCounterProvider({
         name: 'auth_login_success_total',
         help: 'Total successful logins',
         labelNames: ['service', 'userId'],
      }),
      makeCounterProvider({
         name: 'auth_login_failed_total',
         help: 'Total failed logins',
         labelNames: ['service', 'reason'],
      }),
      makeGaugeProvider({                  // ← Gauge not Counter
         name: 'auth_active_users_total',
         help: 'Total currently active users',
         labelNames: ['service'],
      }),
   ],
   exports: [MetricsService],
})

export class MetricsModule { }