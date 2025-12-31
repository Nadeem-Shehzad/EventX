import { forwardRef, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenGuard } from "./guards/ref-token.guard";
import { AccountOwnerShipGuard } from "./guards/ownership.guard";
import { UserModule } from "src/modules/user/user.module";
import { RoleCheckGuard } from "./guards/role.guard";
import { EventModule } from "src/modules/event/event.module";
import { EventService } from "src/modules/event/event.service";


@Module({
   imports: [
      JwtModule.register({}),
      forwardRef(() => UserModule),
      forwardRef(() => EventModule)
   ],
   providers: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      AccountOwnerShipGuard,
      RoleCheckGuard,
      EventService
   ],
   exports: [
      JwtAuthGuard,
      JwtRefreshTokenGuard,
      JwtModule,
      AccountOwnerShipGuard,
      RoleCheckGuard
   ]
})

export class CommonModule { }