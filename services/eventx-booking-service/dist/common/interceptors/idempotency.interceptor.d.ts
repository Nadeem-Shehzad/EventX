import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
export declare class IdempotencyInterceptor implements NestInterceptor {
    private readonly redis;
    constructor(redis: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
