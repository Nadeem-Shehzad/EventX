import {
   CallHandler, ExecutionContext, HttpException,
   Injectable, NestInterceptor
} from "@nestjs/common";
import { of, tap } from "rxjs";
import { RedisService } from "src/redis/redis.service";


@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {

   constructor(private readonly redis: RedisService) { }

   async intercept(context: ExecutionContext, next: CallHandler) {

      const request = context.switchToHttp().getRequest();
      const idempotencyKey = request.headers['idempotency-key'];

      const route = request.url.split('/').pop();

      if (!idempotencyKey) {
         console.warn(`⚠️ No idempotency key provided for route: ${route}`);
         return next.handle();
      }

      console.log(`KEY ==> ${idempotencyKey}`);

      const namespacedKey = `${route}:${idempotencyKey}`;

      const cached = await this.redis.get(`idempotency:${namespacedKey}`);
      if (cached) {
         console.log(`--- ✅ Data Returns from REDIS CACHE [${namespacedKey}] ---`);
         const parsed = JSON.parse(cached);

         if (parsed.isError) {
            throw new HttpException(parsed.error, parsed.statusCode);
         }

         return of(parsed.data);
      }

      console.log(`--- ⚡ CACHE MISS [${namespacedKey}] ---`);

      return next.handle().pipe(
         tap({
            next: async (responseData) => {
               await this.redis.set(
                  `idempotency:${namespacedKey}`,
                  JSON.stringify({ isError: false, data: responseData }),
                  60
               );
            },
            error: async (error) => {
               await this.redis.set(
                  `idempotency:${namespacedKey}`,
                  JSON.stringify({ isError: true, error: error.response, statusCode: error.status }),
                  60
               );
            }
         })
      );
   }
}