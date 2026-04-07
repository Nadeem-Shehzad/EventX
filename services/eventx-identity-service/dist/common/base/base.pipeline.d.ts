import { Model, Document } from 'mongoose';
export declare abstract class BaseRepository<T extends Document> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    private readonly logger;
    protected withTimeout<R>(promise: Promise<R>, ms?: number): Promise<R>;
    protected withRetry<R>(fn: () => Promise<R>, retries?: number, baseDelayMs?: number): Promise<R>;
    protected withFallback<R>(fn: () => Promise<R>, fallback: R, context?: string): Promise<R>;
    private static failures;
    private static openUntil;
    private static readonly THRESHOLD;
    private static readonly OPEN_MS;
    protected withCircuitBreaker<R>(fn: () => Promise<R>): Promise<R>;
    protected safeQuery<R>(fn: () => Promise<R>, options?: {
        timeoutMs?: number;
        timeout?: boolean;
        retry?: boolean;
        circuitBreaker?: boolean;
        fallback?: R;
        context?: string;
    }): Promise<R>;
}
