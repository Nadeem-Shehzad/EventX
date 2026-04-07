import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { ExecutionContext } from "@nestjs/common";
export declare class CustomThrottlerGuard extends ThrottlerGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
    protected throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void>;
}
