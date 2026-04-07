import CircuitBreaker from "opossum";
export declare class CircuitBreakerService {
    private readonly logger;
    create(name: string, fn: (...args: any[]) => Promise<any>): CircuitBreaker;
}
