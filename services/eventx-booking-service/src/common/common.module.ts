import { Global, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenGuard } from "./guards/ref-token.guard";
import { AccountOwnerShipGuard } from "./guards/ownership.guard";
import { RoleCheckGuard } from "./guards/role.guard";
import { MyRedisModule } from "src/redis/redis.module";
import { IdempotencyInterceptor } from "./interceptors/idempotency.interceptor";
import { LoggerService } from "./logger/logger.service";
import { RequestContextService } from "./logger/request-context.service";


@Global()
@Module({
   imports: [
      JwtModule.register({}),
      //forwardRef(() => EventModule),
      MyRedisModule
   ],
   providers: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      AccountOwnerShipGuard,
      RoleCheckGuard,
      IdempotencyInterceptor,
      LoggerService,
      RequestContextService
   ],
   exports: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      JwtModule,
      AccountOwnerShipGuard,
      RoleCheckGuard,
      IdempotencyInterceptor,
      LoggerService,
      RequestContextService
   ]
})

export class CommonModule { }