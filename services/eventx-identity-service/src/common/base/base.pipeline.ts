import { Model, Document } from 'mongoose';
import { Logger, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';


export abstract class BaseRepository<T extends Document> {

   constructor(protected readonly model: Model<T>) { }

   private readonly logger = new Logger(BaseRepository.name);

   // ── 1. Timeout ─────────────────────────────────────────────
   protected withTimeout<R>(promise: Promise<R>, ms = 5000): Promise<R> {
      const timeout = new Promise<never>((_, reject) =>
         setTimeout(() => {
            const err = new Error('Database operation timed out');
            err.name = 'MongooseError';
            reject(err);
         }, ms)
      );

      return Promise.race([promise, timeout]);
   }


   // ── 2. Retry with exponential backoff (5xx / network only) ──
   protected async withRetry<R>(fn: () => Promise<R>, retries = 3, baseDelayMs = 200): Promise<R> {
      let lastErr: any;
      for (let attempt = 0; attempt < retries; attempt++) {
         try {
            return await fn();
         } catch (err: any) {
            const isRetryable =
               err.name === 'MongoNetworkError' ||
               err.name === 'MongoServerSelectionError' ||
               err.name === 'MongooseError';

            if (!isRetryable) throw err; // duplicate key, validation etc — don't retry

            lastErr = err;
            const delay = baseDelayMs * 2 ** attempt; // 200ms, 400ms, 800ms
            this.logger.warn(`DB retry attempt ${attempt + 1}/${retries} after ${delay}ms — ${err.message}`);
            await new Promise(res => setTimeout(res, delay));
         }
      }
      throw lastErr;
   }


   // ── 3. Graceful degradation (return fallback instead of throwing) ─
   protected async withFallback<R>(fn: () => Promise<R>, fallback: R, context?: string): Promise<R> {
      try {
         return await fn();
      } catch (err: any) {
         const isDegradable =
            err.name === 'MongoNetworkError' ||
            err.name === 'MongoServerSelectionError' ||
            err instanceof RequestTimeoutException ||
            err instanceof ServiceUnavailableException;

         if (isDegradable) {
            this.logger.warn(`[${context}] DB unavailable — returning fallback`);
            return fallback; // e.g. [], null, cached value
         }
         throw err; // real errors still throw
      }
   }


   private static failures = 0;
   private static openUntil = 0;
   private static readonly THRESHOLD = 5;    // open after 5 failures
   private static readonly OPEN_MS = 30000; // stay open 30s

   protected withCircuitBreaker<R>(fn: () => Promise<R>): Promise<R> {
      if (Date.now() < BaseRepository.openUntil) {
         // circuit is OPEN — fail fast, don't hit DB at all
         throw new ServiceUnavailableException('Database circuit open — too many recent failures');
      }
      return fn()
         .then(result => {
            BaseRepository.failures = 0; // reset on success
            return result;
         })
         .catch(err => {
            BaseRepository.failures++;
            if (BaseRepository.failures >= BaseRepository.THRESHOLD) {
               BaseRepository.openUntil = Date.now() + BaseRepository.OPEN_MS;
               this.logger.error(
                  `Circuit breaker OPENED — ${BaseRepository.failures} failures. Cooling for 30s.`
               );
            }
            throw err;
         });
   }


   protected async safeQuery<R>(
      fn: () => Promise<R>,
      options?: {
         timeoutMs?: number;
         retry?: boolean;
         fallback?: R;
         context?: string;
      }
   ): Promise<R> {
      const { timeoutMs = 5000, retry = true, fallback, context } = options ?? {};

      // Build the pipeline: fn → timeout → retry → circuit breaker → fallback
      const withTime = () => this.withTimeout(fn(), timeoutMs);
      const withRetried = retry ? () => this.withRetry(withTime) : withTime;
      const withBreaker = () => this.withCircuitBreaker(withRetried);

      if (fallback !== undefined) {
         return this.withFallback(withBreaker, fallback, context);
      }

      return withBreaker();
   }
}