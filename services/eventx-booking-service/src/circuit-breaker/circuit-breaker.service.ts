import { Injectable, Logger } from "@nestjs/common";
import  CircuitBreaker from "opossum";


@Injectable()
export class CircuitBreakerService {

   private readonly logger = new Logger(CircuitBreakerService.name);

   create(name: string, fn: (...args: any[]) => Promise<any>): CircuitBreaker {

      const breaker = new CircuitBreaker(fn, {
         timeout: 5000,
         errorThresholdPercentage: 50,
         resetTimeout: 10000,
         volumeThreshold: 5,
         rollingCountTimeout: 30000,
         rollingCountBuckets: 6,
         errorFilter: (error) => error?.response?.status < 500
      });

      breaker.on('open', () => this.logger.warn(`🔴 [${name}] Circuit OPEN`));
      breaker.on('halfOpen', () => this.logger.log(`🟡 [${name}] Circuit HALF-OPEN — testing`));
      breaker.on('close', () => this.logger.log(`🟢 [${name}] Circuit CLOSED — recovered`));

      // 👇 add these to see every single event opossum fires
      breaker.on('success', (result) => this.logger.log(`✅ [${name}] success`));
      breaker.on('failure', (error) => this.logger.error(`❌ [${name}] failure: ${error.message}`));
      breaker.on('timeout', () => this.logger.warn(`⏱ [${name}] timeout`));
      breaker.on('reject', () => this.logger.warn(`🚫 [${name}] rejected — circuit is OPEN`));
      breaker.on('fallback', (result) => this.logger.warn(`↩️ [${name}] fallback triggered`));

      return breaker;
   }
}