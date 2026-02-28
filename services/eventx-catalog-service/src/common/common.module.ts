import { forwardRef, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenGuard } from "./guards/ref-token.guard";
import { AccountOwnerShipGuard } from "./guards/ownership.guard";
import { RoleCheckGuard } from "./guards/role.guard";
import { EventModule } from "src/modules/event/event.module";
import { MyRedisModule } from "src/redis/redis.module";


@Module({
   imports: [
      JwtModule.register({}),
      forwardRef(() => EventModule),
      MyRedisModule
   ],
   providers: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      AccountOwnerShipGuard,
      RoleCheckGuard,
   ],
   exports: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      JwtModule,
      AccountOwnerShipGuard,
      RoleCheckGuard,
   ]
})

export class CommonModule { }