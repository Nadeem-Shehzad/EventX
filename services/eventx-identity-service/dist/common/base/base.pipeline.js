"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const common_1 = require("@nestjs/common");
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    logger = new common_1.Logger(BaseRepository.name);
    withTimeout(promise, ms = 5000) {
        const timeout = new Promise((_, reject) => setTimeout(() => {
            const err = new Error('Database operation timed out');
            err.name = 'MongooseError';
            reject(err);
        }, ms));
        return Promise.race([promise, timeout]);
    }
    async withRetry(fn, retries = 3, baseDelayMs = 200) {
        let lastErr;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await fn();
            }
            catch (err) {
                const isRetryable = err.name === 'MongoNetworkError' ||
                    err.name === 'MongoServerSelectionError' ||
                    err.name === 'MongooseError';
                if (!isRetryable)
                    throw err;
                lastErr = err;
                const delay = baseDelayMs * 2 ** attempt;
                this.logger.warn(`DB retry attempt ${attempt + 1}/${retries} after ${delay}ms — ${err.message}`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
        throw lastErr;
    }
    async withFallback(fn, fallback, context) {
        try {
            return await fn();
        }
        catch (err) {
            const isDegradable = err.name === 'MongoNetworkError' ||
                err.name === 'MongoServerSelectionError' ||
                err instanceof common_1.RequestTimeoutException ||
                err instanceof common_1.ServiceUnavailableException;
            if (isDegradable) {
                this.logger.warn(`[${context}] DB unavailable — returning fallback`);
                return fallback;
            }
            throw err;
        }
    }
    static failures = 0;
    static openUntil = 0;
    static THRESHOLD = 5;
    static OPEN_MS = 30000;
    withCircuitBreaker(fn) {
        if (Date.now() < BaseRepository.openUntil) {
            throw new common_1.ServiceUnavailableException('Database circuit open — too many recent failures');
        }
        return fn()
            .then(result => {
            BaseRepository.failures = 0;
            return result;
        })
            .catch(err => {
            BaseRepository.failures++;
            if (BaseRepository.failures >= BaseRepository.THRESHOLD) {
                BaseRepository.openUntil = Date.now() + BaseRepository.OPEN_MS;
                this.logger.error(`Circuit breaker OPENED — ${BaseRepository.failures} failures. Cooling for 30s.`);
            }
            throw err;
        });
    }
    async safeQuery(fn, options) {
        const { timeoutMs = 5000, timeout = true, retry = true, circuitBreaker = true, fallback, context, } = options ?? {};
        const withTime = timeout
            ? () => this.withTimeout(fn(), timeoutMs)
            : fn;
        const withRetried = retry
            ? () => this.withRetry(withTime)
            : withTime;
        const withBreaker = circuitBreaker
            ? () => this.withCircuitBreaker(withRetried)
            : withRetried;
        if (fallback !== undefined) {
            return this.withFallback(withBreaker, fallback, context);
        }
        return withBreaker();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.pipeline.js.map