import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';   // ← add Gauge

@Injectable()
export class MetricsService {

   private activeUserIds = new Set<string>();

   constructor(
      @InjectMetric('auth_login_total')
      private readonly loginTotal: Counter<string>,

      @InjectMetric('auth_login_success_total')
      private readonly loginSuccess: Counter<string>,

      @InjectMetric('auth_login_failed_total')
      private readonly loginFailed: Counter<string>,

      @InjectMetric('auth_active_users_total')
      private readonly activeUsers: Gauge<string>,

      @InjectMetric('auth_register_total')
      private readonly registerTotal: Counter<string>,

      @InjectMetric('auth_register_success_total')
      private readonly registerSuccess: Counter<string>,

      @InjectMetric('auth_register_failed_total')
      private readonly registerFailed: Counter<string>
   ) { }


   // --- Login Metrics ---
   incrementLoginAttempt() {
      this.loginTotal.inc({ status: 'attempt' });
   }

   incrementLoginSuccess(userId: string) {
      this.loginSuccess.inc({
         service: 'identity-service',
         userId,
      });

      if (!this.activeUserIds.has(userId)) {
         this.activeUserIds.add(userId);
         this.activeUsers.inc({ service: 'identity-service' });
      }
   }

   incrementLoginFailed(reason: 'invalid_credentials' | 'user_not_found' | 'unknown') {
      this.loginFailed.inc({
         service: 'identity-service',
         reason,
      });
   }

   decrementActiveUsers(userId: string) {
      if (this.activeUserIds.has(userId)) {
         this.activeUserIds.delete(userId);
         this.activeUsers.dec({ service: 'identity-service' });
      }
   }


   // --- Register Metrics ---
   incrementRegisterAttempts() {
      this.registerTotal.inc({ status: 'attempt' });
   }

   incrementRegisterSuccess(userId: string) {
      this.registerSuccess.inc({
         service: 'identity-service',
         userId,
      });
   }

   incrementRegisterFailed(reason: 'invalid_credentials' | 'db_down' | 'unknown') {
      this.registerFailed.inc({
         service: 'identity-service',
         reason,
      });
   }
}