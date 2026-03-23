import { Model, Document } from 'mongoose';
import { throwDbException } from '../utils/db-error.util';
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
   protected async withRetry<R>(
      fn: () => Promise<R>,
      retries = 3,
      baseDelayMs = 200
   ): Promise<R> {
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
            this.logger.warn(
               `DB retry attempt ${attempt + 1}/${retries} after ${delay}ms — ${err.message}`
            );
            await new Promise(res => setTimeout(res, delay));
         }
      }
      throw lastErr;
   }


   // ── 3. Graceful degradation (return fallback instead of throwing) ─
   protected async withFallback<R>(
      fn: () => Promise<R>,
      fallback: R,
      context?: string
   ): Promise<R> {
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


   // ── 4. Circuit breaker state (simple in-memory) ─────────────
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


   async create(data: Partial<T>): Promise<T> {
      try {
         const method = this.model.create(data);
         return await this.withTimeout(method) as T;

      } catch (err) {
         throwDbException(err, `${this.model.modelName}.create`);
      }
   }


   async findOne(filter: object): Promise<T | null> {
      try {
         const method = this.model.findOne(filter).exec();
         return await this.withTimeout(method);

      } catch (err) {
         throwDbException(err, `${this.model.modelName}.findOne`);
      }
   }


   async findById(id: string): Promise<T | null> {
      try {
         const method = this.model.findById(id).exec();
         return await this.withTimeout(method);

      } catch (err) {
         throwDbException(err, `${this.model.modelName}.findById`);
      }
   }


   async updateOne(filter: object, update: Partial<T>): Promise<T | null> {
      try {
         const method = this.model.findOneAndUpdate(filter, update, { new: true }).exec();
         return await this.withTimeout(method);

      } catch (err) {
         throwDbException(err, `${this.model.modelName}.updateOne`);
      }
   }


   async deleteOne(filter: object): Promise<boolean> {
      try {
         const method = this.model.deleteOne(filter).exec();
         const result = await this.withTimeout(method);
         return result.deletedCount > 0;

      } catch (err) {
         throwDbException(err, `${this.model.modelName}.deleteOne`);
      }
   }
}