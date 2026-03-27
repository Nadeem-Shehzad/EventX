import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
   ServiceUnavailableException,
   UnauthorizedException
} from "@nestjs/common";

import { RegisterDTO } from "./dto/request/register.dto";
import { UserService } from "../user/user.service";
import { UserResponseDTO } from "../user/dto/user-response.dto";
import { plainToInstance } from "class-transformer";
import { LoginDTO } from "./dto/request/login.dto";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ChangePasswordDTO } from "./dto/request/change-password.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { randomBytes } from "crypto";
import { RedisService } from "src/redis/redis.service";
import { ResetPasswordDTO } from "./dto/request/reset-password.dto";
import { AuthHelper } from "./helpers/auth.helper";
import { LoggerService } from "../../common/logger/logger.service";
import { MetricsService } from "../../metrics/metrics.service";



@Injectable()
export class AuthService {

   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly mailService: MailerService,
      private readonly redis: RedisService,
      private readonly helper: AuthHelper,
      private readonly pinoLogger: LoggerService,
      private readonly metricsService: MetricsService
   ) { }

   private readonly logger = new Logger(AuthService.name);


   async register(data: RegisterDTO): Promise<UserResponseDTO> {

      const hashedPassword = await this.helper.hashValue(data.password, 'credentials');

      const user = await this.userService.createUser({
         ...data,
         password: hashedPassword,
      });

      if (!user) throw new InternalServerErrorException('User creation failed');

      // Fire verification email — non-critical, must never block registration
      this.sendVerificationEmail(String(user._id), user.email).catch(err =>
         this.logger.error(`Verification email failed for ${user.email}: ${err.message}`)
      );

      return plainToInstance(UserResponseDTO, user.toObject(), {
         excludeExtraneousValues: true,
      });
   }


   async login(loginData: LoginDTO) {
      
      this.metricsService.incrementLoginAttempt();

      const user = await this.userService.getUserByEmailWithPassword(loginData.email);
      if (!user) throw new NotFoundException('User not registered');

      this.pinoLogger.info('User Login Started', { userId: user._id.toString() });

      const passwordMatched = await this.helper.compareValue(
         loginData.password,
         user.password,
         'password',
      );

      if (!passwordMatched) {
         this.pinoLogger.error('Try Again', {
            userId: user._id.toString(),
            error: 'Invalid Password'
         });

         this.metricsService.incrementLoginFailed('invalid_credentials');

         throw new UnauthorizedException('Invalid password');
      }

      const payload = this.helper.buildPayload(user);
      const accessToken = this.helper.signAccessToken(payload);
      const refreshToken = this.helper.signRefreshToken(payload);

      this.helper.hashValue(refreshToken, 'refresh token')
         .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
         .catch(err =>
            this.logger.error(`Failed to persist refresh token for ${user._id}: ${err.message}`)
         );

      this.pinoLogger.info('User login success', { userId: user._id.toString() });

      this.metricsService.incrementLoginSuccess(user._id.toString());

      return { accessToken, refreshToken };
   }


   async changePassword(id: string, cpData: ChangePasswordDTO) {
      const user = await this.userService.findUserByIDWithPassword(id);
      if (!user) throw new NotFoundException('User not found');

      const passwordMatched = await this.helper.compareValue(
         cpData.currentPassword,
         user.password,
         'current password',
      );
      if (!passwordMatched) throw new UnauthorizedException('Invalid current password');

      // Both are input validation errors → BadRequestException
      if (cpData.currentPassword === cpData.newPassword) {
         throw new BadRequestException('New password must differ from current password');
      }
      if (cpData.newPassword !== cpData.confirmPassword) {
         throw new BadRequestException('New password and confirm password do not match');
      }

      const newHashedPassword = await this.helper.hashValue(cpData.newPassword, 'new password');

      await this.userService.updateUser(user._id, { password: newHashedPassword });

      return { message: 'Password changed successfully' };
   }


   async logout(id: string) {
      await this.userService.removeUserToken(id);
      return { loggedOut: true };
   }


   async refreshToken(userData: any, rf_Token: string) {
      const user = await this.userService.getUserByIdWithRefreshToken(userData.id);
      if (!user) throw new NotFoundException('User not found');

      if (!user.refreshToken) throw new UnauthorizedException('No active session');

      const isValid = await this.helper.compareValue(
         rf_Token,
         user.refreshToken,
         'refresh token',
      );
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const payload = this.helper.buildPayload(user);
      const accessToken = this.helper.signAccessToken(payload);
      const newRefreshToken = this.helper.signRefreshToken(payload);

      // Non-critical — persist new refresh token without blocking response
      this.helper.hashValue(newRefreshToken, 'refresh token')
         .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
         .catch(err =>
            this.logger.error(`Failed to rotate refresh token for ${user._id}: ${err.message}`)
         );

      return { accessToken, refreshToken: newRefreshToken };
   }


   async sendVerificationEmail(id: string, email: string): Promise<void> {
      let token: string;
      try {
         token = await this.jwtService.signAsync({ id }, { expiresIn: '15m' });
      } catch {
         throw new InternalServerErrorException('Failed to generate verification token');
      }

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/verify-email?token=${token}`;

      // Mail failure is logged but never throws to caller
      // Caller (register) fires this without await intentionally
      try {
         await this.mailService.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `
          <h2>Email verification</h2>
          <p>Click below to verify your email:</p>
          <a href="${url}">${url}</a>
        `,
         });
      } catch (err) {
         this.logger.error(`Failed to send verification email to ${email}: ${err.message}`);
         // intentionally not rethrowing — mail is non-critical
      }
   }


   async verifyEmail(token: string) {

      let payload: any;

      try {
         payload = await this.jwtService.verifyAsync(token);
      } catch (err) {
         if (err instanceof TokenExpiredError) {
            throw new BadRequestException('Verification link has expired');
         }
         if (err instanceof JsonWebTokenError) {
            throw new BadRequestException('Invalid verification token');
         }
         throw new InternalServerErrorException('Token verification failed');
      }

      const user = await this.userService.getUserById(payload.id);
      if (!user) throw new NotFoundException('User not found');

      if (user.isVerified) return { message: 'Email already verified' };

      await this.userService.updateUser(user._id, { isVerified: true });

      return { message: 'Email verified successfully' };
   }


   async forgotPassword(email: string) {

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
         return { message: 'If this email is registered, a reset link has been sent' };
      }

      const token = randomBytes(32).toString('hex');
      const userId = String(user._id);

      try {
         await this.redis.set(`fp:${token}`, userId, 60 * 15);
      } catch (err) {
         this.logger.error(`Redis unavailable for forgot password: ${err.message}`);
         throw new ServiceUnavailableException('Unable to process request, please try again');
      }

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/reset-password?token=${token}`;

      // Mail is non-critical — token is already in Redis
      // If mail fails, user can request again
      this.mailService
         .sendMail({
            to: email,
            subject: 'Reset your password',
            html: `
          <h2>Reset password</h2>
          <p>Click below to reset your password:</p>
          <a href="${url}">${url}</a>
        `,
         })
         .catch(err =>
            this.logger.error(`Failed to send reset email to ${email}: ${err.message}`)
         );

      return { message: 'If this email is registered, a reset link has been sent' };
   }


   async resetPassword(dto: ResetPasswordDTO) {
      const { token, newPassword, confirmPassword } = dto;

      if (newPassword !== confirmPassword) {
         throw new BadRequestException('Passwords do not match');
      }

      let userId: string | null;
      try {
         userId = await this.redis.get(`fp:${token}`);
      } catch (err) {
         this.logger.error(`Redis unavailable for reset password: ${err.message}`);
         throw new ServiceUnavailableException('Unable to process request, please try again');
      }

      if (!userId) throw new BadRequestException('Invalid or expired token');

      const user = await this.userService.getUserById(userId);
      if (!user) throw new NotFoundException('User not found');

      // Hash first — if this fails, token stays valid so user can retry
      const hashed = await this.helper.hashValue(newPassword, 'new password');

      // Write new password
      await this.userService.updateUser(userId, { password: hashed });

      // Delete token only after successful password update
      // If del fails it's non-critical — token TTL (15m) will clean it up
      this.redis.del(`fp:${token}`).catch(err =>
         this.logger.warn(`Failed to delete reset token from Redis: ${err.message}`)
      );

      return { message: 'Password reset successfully' };
   }
}