import { forwardRef, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenGuard } from "./guards/ref-token.guard";
import { AccountOwnerShipGuard } from "./guards/ownership.guard";
import { UserModule } from "src/modules/user/user.module";


@Module({
   imports: [
      JwtModule.register({}),
      forwardRef(() => UserModule),
   ],
   providers: [JwtAuthGuard, JwtRefreshTokenGuard, AccountOwnerShipGuard],
   exports: [JwtAuthGuard, JwtRefreshTokenGuard, JwtModule, AccountOwnerShipGuard]
})

export class CommonModule { }