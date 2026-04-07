import { Redis } from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    set(key: string, value: string, ttl?: number): Promise<"OK">;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    decrby(key: string, value: number): Promise<number>;
    incrby(key: string, value: number): Promise<number>;
    pipeline(): import("ioredis").ChainableCommander;
    delPattern(pattern: string): Promise<void>;
}
