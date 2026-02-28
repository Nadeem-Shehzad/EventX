import {
   BadRequestException, Body, Controller,
   Post, Query, Req, UploadedFile, UseGuards,
   UseInterceptors
} from "@nestjs/common";

import { SkipThrottle, Throttle } from "@nestjs/throttler";

import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/request/register.dto";
import { LoginDTO } from "./dto/request/login.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { JwtRefreshTokenGuard } from "src/common/guards/ref-token.guard";
import type { Request } from "express";
import { ChangePasswordDTO } from "./dto/request/change-password.dto";
import { GetUserEmail } from "src/common/decorators/user-email";
import { ForgotPasswordDTO } from "./dto/request/forgot-password.dto";
import { ResetPasswordDTO } from "./dto/request/reset-password.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponseDTO } from "../user/dto/user-response.dto";
import { LoginResponseDTO } from "./swagger/response/login-response.dto";
import { ForgotPasswordResponseDTO } from "./swagger/response/forgot-password-response.dto";


@ApiTags('auth')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {

   constructor(private readonly authService: AuthService) { }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('register')
   @ApiOperation({ summary: 'Register user' })
   @ApiResponse({
      status: 201,
      description: 'User registered',
      type: UserResponseDTO
   })
   @ApiResponse({ status: 400, description: 'Invalid payload' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   @UseInterceptors(
      FileInterceptor('image', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
      })
   )
   register(
      @Body() data: RegisterDTO,
      @UploadedFile() file?: Express.Multer.File
   ) {

      if (!file) throw new BadRequestException('Image is required');

      const imageData = {
         url: file.path,
         publicId: file.filename
      };

      data.image = imageData;
      return this.authService.register(data);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('login')
   @ApiOperation({ summary: 'Login user' })
   @ApiResponse({
      status: 200,
      description: 'User LoggedIn',
      type: LoginResponseDTO
   })
   @ApiResponse({ status: 404, description: 'Invalid credentials' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   login(@Body() loginData: LoginDTO) {
      return this.authService.login(loginData);
   }


   @UseGuards(JwtAuthGuard)
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('change-password')
   @ApiOperation({ summary: 'Change password' })
   @ApiResponse({
      status: 200,
      description: 'Password Changed Successfully.',
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'Invalid credentials' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   changePassword(@GetUserID() id: string, @Body() cpData: ChangePasswordDTO): Promise<string> {
      return this.authService.changePassword(id, cpData);
   }


   @UseGuards(JwtAuthGuard)
   @SkipThrottle()
   @Post('logout')
   @ApiOperation({ summary: 'logout' })
   @ApiResponse({
      status: 200,
      description: 'LoggedOut.',
   })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server Error' })
   logout(@GetUserID() id: string) {
      return this.authService.logout(id);
   }


   @UseGuards(JwtRefreshTokenGuard)
   @Post('refresh')
   refreshToken(@Req() req: Request) {
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


   @Post('forgot-password')
   @ApiOperation({ summary: 'forgot password' })
   @ApiResponse({
      status: 200,
      type: ForgotPasswordResponseDTO
   })
   @ApiResponse({ status: 500, description: 'Server Error' })
   forgotPassword(@Body() body: ForgotPasswordDTO) {
      return this.authService.forgotPassword(body.email);
   }


   @Post('reset-password')
   @ApiOperation({ summary: 'reset password' })
   @ApiResponse({
      status: 200,
      description: 'Password reset successfully.'
   })
   @ApiResponse({ status: 500, description: 'Server Error' })
   resetPassword(@Body() dto: ResetPasswordDTO) {
      return this.authService.resetPassword(dto);
   }
}