import {
   Body,
   Controller,
   Post,
   Query,
   Req,
   UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { JwtRefreshTokenGuard } from "src/common/guards/ref-token.guard";
import type { Request } from "express";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { GetUserEmail } from "src/common/decorators/user-email";


@Controller('auth')
export class AuthController {

   constructor(private readonly authService: AuthService) { }

   @Post('register')
   register(@Body() data: RegisterDTO) {
      return this.authService.register(data);
   }

   @Post('login')
   login(@Body() loginData: LoginDTO) {
      return this.authService.login(loginData);
   }

   @UseGuards(JwtAuthGuard)
   @Post('change-password')
   changePassword(@GetUserID() id: string, @Body() cpData: ChangePasswordDTO): Promise<string> {
      return this.authService.changePassword(id, cpData);
   }

   @UseGuards(JwtAuthGuard)
   @Post('logout')
   logout(@GetUserID() id: string) {
      return this.authService.logout(id);
   }

   @UseGuards(JwtRefreshTokenGuard)
   @Post('refresh')
   refresh(@Req() req: Request) {
      const user = req['user'];
      const rf_Token = req['rf_Token'];

      return this.authService.refreshToken(user, rf_Token);
   }

   @UseGuards(JwtAuthGuard)
   @Post('send-verification-email')
   sendVerificationEmail(@GetUserID() id: string, @GetUserEmail() email: string) {
      return this.authService.sendVerificationEmail(id, email);
   }

   @Post('verify-email')
   verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
   }
}