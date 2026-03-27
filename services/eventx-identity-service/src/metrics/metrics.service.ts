import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';   // ← add Gauge

@Injectable()
export class MetricsService {

   constructor(
      @InjectMetric('auth_login_total')
      private readonly loginTotal: Counter<string>,

      @InjectMetric('auth_login_success_total')
      private readonly loginSuccess: Counter<string>,

      @InjectMetric('auth_login_failed_total')
      private readonly loginFailed: Counter<string>,

      @InjectMetric('auth_active_users_total')
      private readonly activeUsers: Gauge<string>,   // ← Gauge not Counter
   ) { }

   incrementLoginAttempt() {
      this.loginTotal.inc({ status: 'attempt' });
   }

   incrementLoginSuccess(userId: string) {
      this.loginSuccess.inc({
         service: 'identity-service',
         userId,
      });
      this.activeUsers.inc({ service: 'identity-service' });  // ← Gauge has inc
   }

   incrementLoginFailed(reason: 'invalid_credentials' | 'user_not_found' | 'unknown') {
      this.loginFailed.inc({
         service: 'identity-service',
         reason,
      });
   }

   decrementActiveUsers() {
      this.activeUsers.dec({ service: 'identity-service' });  // ← Gauge has dec ✅
   }
}