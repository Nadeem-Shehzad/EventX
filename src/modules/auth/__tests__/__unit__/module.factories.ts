import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../auth.controller";
import { AuthService } from "../../auth.service";
import { RedisService } from "src/redis/redis.service";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { JwtRefreshTokenGuard } from "src/common/guards/ref-token.guard";
import { MockGuard } from "./auth.controller.spec";


export async function createAuthTestingModule(authServiceMock: any) {
   const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
         { provide: AuthService, useValue: authServiceMock },
         { provide: RedisService, useValue: {} },
         { provide: MailerService, useValue: {} }
      ]
   })
      .overrideGuard(JwtAuthGuard).useValue(new MockGuard())
      .overrideGuard(JwtRefreshTokenGuard).useValue(new MockGuard())
      .compile();

   return {
      controller: module.get<AuthController>(AuthController),
      authService: module.get<AuthService>(AuthService),
   };
}