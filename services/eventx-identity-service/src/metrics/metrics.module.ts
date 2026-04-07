import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import {
   makeCounterProvider,
   makeGaugeProvider,
   makeHistogramProvider
} from '@willsoto/nestjs-prometheus';
//import { PersistentMetricsService } from './persistent-metrics/metrics.service';

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


      makeCounterProvider({
         name: 'auth_logout_total',
         help: 'Total logouts',
         labelNames: ['service'],
      }),


      makeCounterProvider({
         name: 'auth_register_total',
         help: 'Total register attempts',
         labelNames: ['status']
      }),
      makeCounterProvider({
         name: 'auth_register_success_total',
         help: 'Total successful register',
         labelNames: ['service']
      }),
      makeCounterProvider({
         name: 'auth_register_failed_total',
         help: 'Total failed register',
         labelNames: ['service', 'reason']
      }),

      makeHistogramProvider({
         name: 'auth_login_duration_seconds',
         help: 'How long login takes in seconds',
         labelNames: ['status'],
         buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]  // ← time buckets in seconds
      })
      
   ],
   exports: [
      MetricsService,
      //PersistentMetricsService,
   ],
})

export class MetricsModule { }