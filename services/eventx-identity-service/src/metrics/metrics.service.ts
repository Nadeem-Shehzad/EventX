import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
   private readonly register = new client.Registry();

   constructor() {
      // default system metrics (cpu, memory etc.)
      client.collectDefaultMetrics({ register: this.register });
   }

   // 🔥 LOGIN COUNTER
   private authLoginCounter = new client.Counter({
      name: 'auth_login_total',
      help: 'Total login attempts',
      labelNames: ['status'], // success | failure
      registers: [this.register],
   });

   // ===== METHODS =====

   incrementLogin(status: 'success' | 'failure') {
      this.authLoginCounter.inc({ status });
   }

   async getMetrics() {
      return this.register.metrics();
   }

   getContentType() {
      return this.register.contentType;
   }
}