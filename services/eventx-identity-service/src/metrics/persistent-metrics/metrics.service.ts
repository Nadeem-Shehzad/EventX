import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PersistentMetricsService implements OnModuleInit {

   private registry!: client.Registry;
   private loginTotal!: client.Counter;
   private loginSuccess!: client.Counter;
   private loginFailed!: client.Counter;
   private logoutTotal!: client.Counter;
   private registerTotal!: client.Counter;
   private gateway!: client.Pushgateway<'text/plain; version=0.0.4; charset=utf-8'>;

   async onModuleInit() {
      this.registry = new client.Registry();

      this.loginTotal = new client.Counter({
         name: 'auth_login_total_persistent',
         help: 'Total login attempts persistent',
         labelNames: ['service'],
         registers: [this.registry],
      });

      this.loginSuccess = new client.Counter({
         name: 'auth_login_success_persistent',
         help: 'Total successful logins persistent',
         labelNames: ['service'],
         registers: [this.registry],
      });

      this.loginFailed = new client.Counter({
         name: 'auth_login_failed_persistent',
         help: 'Total failed logins persistent',
         labelNames: ['service'],
         registers: [this.registry],
      });

      this.logoutTotal = new client.Counter({
         name: 'auth_logout_total_persistent',
         help: 'Total logouts persistent',
         labelNames: ['service'],
         registers: [this.registry],
      });

      this.registerTotal = new client.Counter({
         name: 'auth_register_total_persistent',
         help: 'Total registrations persistent',
         labelNames: ['service'],
         registers: [this.registry],
      });

      this.gateway = new client.Pushgateway(
         'http://localhost:9091',
         [],
         this.registry,
      );
   }

   private async push() {
      try {
         await this.gateway.pushAdd({
            jobName: 'identity-service',
            groupings: { instance: 'identity-service' },
         });
      } catch (err) {
         const message = err instanceof Error ? err.message : String(err);
         console.error('Failed to push to Pushgateway:', message);
      }
   }

   async incrementLoginTotal() {
      this.loginTotal.inc({ service: 'identity-service' });
      await this.push();
   }

   async incrementLoginSuccess() {
      this.loginSuccess.inc({ service: 'identity-service' });
      await this.push();
   }

   async incrementLoginFailed() {
      this.loginFailed.inc({ service: 'identity-service' });
      await this.push();
   }

   async incrementLogout() {
      this.logoutTotal.inc({ service: 'identity-service' });
      await this.push();
   }

   async incrementRegister() {
      this.registerTotal.inc({ service: 'identity-service' });
      await this.push();
   }
}