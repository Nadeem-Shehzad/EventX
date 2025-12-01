import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";


@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
   protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
      throw new Error('Too many requests, please try again later.');
   }
}