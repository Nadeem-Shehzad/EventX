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
import { IdempotencyInterceptor } from "src/common/interceptors/idempotency.interceptor";
import { trace, SpanStatusCode } from '@opentelemetry/api';


// 2. Initialize the tracer for this file
const tracer = trace.getTracer('identity-service');


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
      IdempotencyInterceptor,
      FileInterceptor('image', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
         fileFilter: (req, file, cb) => {
            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowed.includes(file.mimetype)) {
               return cb(new BadRequestException('Only JPEG, PNG, webp images are allowed'), false);
            }
            cb(null, true);
         },
      })
   )
   async register(
      @Body() data: RegisterDTO,
      @UploadedFile() file?: Express.Multer.File
   ) {

      return tracer.startActiveSpan('POST /register', async (rootSpan) => {
         try {

            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/register',
               'user.email': data.email
            });

            if (!file) throw new BadRequestException('Image is required');

            const imageData = {
               url: file.path,
               publicId: file.filename
            };

            data.image = imageData;
            const result = await this.authService.register(data);

            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            const err = error as Error;
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw error; // Re-throw to NestJS

         } finally {
            rootSpan.end();
         }
      });
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

      return tracer.startActiveSpan('POST /login', async (rootSpan) => {
         try {
            // 4. Attach metadata to the span for easy searching in Grafana
            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/login',
               'user.email': loginData.email // Good for debugging specific user issues
            });

            // 5. Call the service. Context propagation handles linking automatically!
            const result = await this.authService.login(loginData);

            // 6. If successful, mark the span as OK
            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            // 7. If ANY error bubbles up (404, 401), record it on the trace
            const err = error as Error;
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw error; // Re-throw to NestJS
         } finally {
            // 8. CRITICAL: Always end the span!
            rootSpan.end();
         }
      });
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
   changePassword(@GetUserID() id: string, @Body() cpData: ChangePasswordDTO): Promise<{ message: string } | undefined> {
      return tracer.startActiveSpan('POST /change-password', async (rootSpan) => {
         try {

            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/change-password',
               'user.id': id
            });

            const result = await this.authService.changePassword(id, cpData);

            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            const err = error as Error;
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw err;

         } finally {
            rootSpan.end();
         }
      });
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

      return tracer.startActiveSpan('POST /logout', async (rootSpan) => {
         try {

            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/logout',
               'user.id': id
            });

            const result = await this.authService.logout(id);

            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            const err = error as Error;
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw err;

         } finally {
            rootSpan.end();
         }
      });
   }


   @UseGuards(JwtRefreshTokenGuard)
   @Post('refresh')
   refreshToken(@Req() req: Request) {
      const user = req['user'];
      const rf_Token = req['rf_Token'];

      return this.authService.refreshToken(user, rf_Token);
   }


   @UseInterceptors(IdempotencyInterceptor)
   @UseGuards(JwtAuthGuard)
   @Post('send-verification-email')
   sendVerificationEmail(@GetUserID() id: string, @GetUserEmail() email: string) {
      return this.authService.sendVerificationEmail(id, email);
   }


   @UseInterceptors(IdempotencyInterceptor)
   @Post('verify-email')
   verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
   }


   @UseInterceptors(IdempotencyInterceptor)
   @Post('forgot-password')
   @ApiOperation({ summary: 'forgot password' })
   @ApiResponse({
      status: 200,
      type: ForgotPasswordResponseDTO
   })
   @ApiResponse({ status: 500, description: 'Server Error' })
   forgotPassword(@Body() body: ForgotPasswordDTO) {

      return tracer.startActiveSpan('POST /forgot-password', async (rootSpan) => {
         try {

            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/forgotPassword',
               'user.email': body.email
            });

            const result = await this.authService.forgotPassword(body.email);
            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            const err = error as Error;

            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw err;
            
         } finally {
            rootSpan.end();
         }
      });
   }


   @UseInterceptors(IdempotencyInterceptor)
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