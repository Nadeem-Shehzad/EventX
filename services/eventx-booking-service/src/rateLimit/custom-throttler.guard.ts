import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {

   // ✅ skip throttling for RabbitMQ/non-HTTP contexts
   canActivate(context: ExecutionContext): Promise<boolean> {
      if (context.getType() !== 'http') {
         return Promise.resolve(true);
      }
      return super.canActivate(context);
   }

   protected async throwThrottlingException(
      context: ExecutionContext,
      throttlerLimitDetail: ThrottlerLimitDetail
   ): Promise<void> {
      throw new Error('Too many requests, please try again later.');
   }
}