import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenGuard } from "./guards/ref-token.guard";


@Module({
   imports: [
      JwtModule.register({}),
   ],
   providers: [JwtAuthGuard, JwtRefreshTokenGuard],
   exports: [JwtAuthGuard, JwtRefreshTokenGuard]
})

export class CommonModule { }