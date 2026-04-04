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

      this.metricsService.incrementRegisterAttempts();
      this.pinoLogger.info('Register attempt started');

      const hashedPassword = await this.helper.hashValue(data.password, 'credentials');

      const user = await this.userService.createUser({
         ...data,
         password: hashedPassword,
      });

      if (!user) {
         this.metricsService.incrementRegisterFailed('invalid_credentials');
         this.pinoLogger.error('Register attempt failed', { reason: 'invalid_credentials' });
         throw new InternalServerErrorException('User creation failed');
      }

      this.pinoLogger.info('Register user ', { userId: user._id.toString() });
      this.metricsService.incrementRegisterSuccess();

      this.sendVerificationEmail(String(user._id), user.email).catch((err) => {
         this.logger.error(`Verification email failed for ${user.email}: ${err.message}`)
         this.pinoLogger.error(`Verification email failed for ${user.email}: ${err.message}`);
      });

      return plainToInstance(UserResponseDTO, user.toObject(), {
         excludeExtraneousValues: true,
      });
   }


   async login(loginData: LoginDTO) {

      this.metricsService.incrementLoginAttempt();
      this.pinoLogger.info('Login attempt started', { email: loginData.email });

      const user = await this.userService.getUserByEmailWithPassword(loginData.email);
      if (!user) {
         this.pinoLogger.warn('Login failed - user not found', { email: loginData.email });
         this.metricsService.incrementLoginFailed('user_not_found');
         throw new NotFoundException('User not registered');
      }

      const passwordMatched = await this.helper.compareValue(
         loginData.password,
         user.password,
         'password',
      );

      if (!passwordMatched) {

         this.pinoLogger.warn('Login failed - invalid password', {
            userId: user._id.toString(),
            error: 'Invalid Password'
         });

         this.metricsService.incrementLoginFailed('invalid_credentials');
         throw new UnauthorizedException('Invalid password');
      }

      const payload = this.helper.buildPayload(user);
      const accessToken = this.helper.signAccessToken(payload);
      const refreshToken = this.helper.signRefreshToken(payload);

      this.pinoLogger.info('Login credentials verified', { userId: user._id.toString() });

      this.helper.hashValue(refreshToken, 'refresh token')
         .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
         .catch((err) => {
            this.pinoLogger.error('Failed to persist refresh token', {
               userId: user._id.toString(),
               error: err.message
            });
         });

      this.pinoLogger.info('Login successful', { userId: user._id.toString() });
      this.metricsService.incrementLoginSuccess(user._id.toString());

      return { accessToken, refreshToken };
   }


   async changePassword(id: string, cpData: ChangePasswordDTO) {

      this.pinoLogger.info('changePassword attempt started', { UserId: id.toString() });

      const user = await this.userService.findUserByIDWithPassword(id);
      if (!user) {
         this.pinoLogger.error('User not found', { UserId: id.toString() });
         throw new NotFoundException('User not found');
      }

      const passwordMatched = await this.helper.compareValue(
         cpData.currentPassword,
         user.password,
         'current password',
      );

      if (!passwordMatched) {
         this.pinoLogger.error('Invalid current password', { UserId: id.toString() });
         throw new UnauthorizedException('Invalid current password')
      }

      if (cpData.currentPassword === cpData.newPassword) {
         this.pinoLogger.error('New password must differ from current password', { UserId: id.toString() });
         throw new BadRequestException('New password must differ from current password');
      }

      if (cpData.newPassword !== cpData.confirmPassword) {
         this.pinoLogger.error('New password and confirm password do not match', { UserId: id.toString() });
         throw new BadRequestException('New password and confirm password do not match');
      }

      const newHashedPassword = await this.helper.hashValue(cpData.newPassword, 'new password');

      await this.userService.updateUser(user._id, { password: newHashedPassword });
      this.pinoLogger.info('Password changed successfully', { UserId: id.toString() });

      return { message: 'Password changed successfully' };
   }


   async logout(userId: string) {
      this.pinoLogger.info('logout attempt started', { UserId: userId.toString() });
      await this.userService.removeUserToken(userId);
      this.metricsService.decrementActiveUsers(userId);
      this.pinoLogger.info('logout successfully', { UserId: userId.toString() });
      return { loggedOut: true };
   }


   async refreshToken(userData: any, rf_Token: string) {
      this.pinoLogger.info('refreshToken attempt started', { UserId: userData.id.toString() });

      const user = await this.userService.getUserByIdWithRefreshToken(userData.id);
      if (!user) {
         this.pinoLogger.error('User not found', { UserId: userData.id.toString() });
         throw new NotFoundException('User not found')
      }

      if (!user.refreshToken) {
         this.pinoLogger.error('No active session', { UserId: userData.id.toString() });
         throw new UnauthorizedException('No active session')
      }

      const isValid = await this.helper.compareValue(
         rf_Token,
         user.refreshToken,
         'refresh token',
      );

      if (!isValid) {
         this.pinoLogger.warn('Invalid refresh token', { UserId: userData.id.toString() });
         throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = this.helper.buildPayload(user);
      const accessToken = this.helper.signAccessToken(payload);
      const newRefreshToken = this.helper.signRefreshToken(payload);

      this.pinoLogger.info('new refresh token generated', { rfToken: newRefreshToken });

      // Non-critical — persist new refresh token without blocking response
      this.helper.hashValue(newRefreshToken, 'refresh token')
         .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
         .catch(err =>
            this.logger.error(`Failed to rotate refresh token for ${user._id}: ${err.message}`)
         );

      return { accessToken, refreshToken: newRefreshToken };
   }


   async sendVerificationEmail(id: string, email: string): Promise<void> {

      this.pinoLogger.info('sendVerificationEmail attempt started', { email: email.toString() });

      let token: string;
      try {
         token = await this.jwtService.signAsync({ id }, { expiresIn: '15m' });
      } catch {
         this.pinoLogger.error('Failed to generate verification token', { email: email.toString() });
         throw new InternalServerErrorException('Failed to generate verification token');
      }

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/v1/verify-email?token=${token}`;

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
         const message = err instanceof Error ? err.message : String(err);
         this.pinoLogger.error(`Failed to send verification email`, { email, error: message });
         this.logger.error(`Failed to send verification email to ${email}: ${message}`);
         // intentionally not rethrowing — mail is non-critical
      }
   }


   async verifyEmail(token: string) {
      this.pinoLogger.info('verifyEmail attempt started');

      let payload: any;

      try {
         payload = await this.jwtService.verifyAsync(token);
      } catch (err) {
         this.pinoLogger.error('Token verification failed', { token: token.toString() });
         if (err instanceof TokenExpiredError) {
            throw new BadRequestException('Verification link has expired');
         }
         if (err instanceof JsonWebTokenError) {
            throw new BadRequestException('Invalid verification token');
         }
         throw new InternalServerErrorException('Token verification failed');
      }

      const user = await this.userService.getUserById(payload.id);
      if (!user) {
         this.pinoLogger.error('User not found', { UserId: payload.id.toString() });
         throw new NotFoundException('User not found')
      }

      if (user.isVerified) {
         this.pinoLogger.warn('Email already verified', { UserId: payload.id.toString() });
         return { message: 'Email already verified' }
      }

      await this.userService.updateUser(user._id, { isVerified: true });
      this.pinoLogger.info('Email verified successfully', { UserId: user._id.toString() });

      return { message: 'Email verified successfully' };
   }


   async forgotPassword(email: string) {
      this.pinoLogger.info('forgotPassword attempt started');

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
         this.pinoLogger.error('User not Found', { email: email.toString() });
         return { message: 'User not Found' };
      }

      const token = randomBytes(32).toString('hex');
      const userId = String(user._id);

      try {
         await this.redis.set(`fp:${token}`, userId, 60 * 15);
      } catch (err) {
         const message = err instanceof Error ? err.message : String(err);
         this.pinoLogger.error(`Redis unavailable for forgot password`, { userId, error: message });
         this.logger.error(`Redis unavailable for forgot password: ${message}`);
         throw new ServiceUnavailableException('Unable to process request, please try again');
      }

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/v1/reset-password?token=${token}`;

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

      this.pinoLogger.info('If this email is registered, a reset link has been sent', { email: email.toString() });
      return { message: 'If this email is registered, a reset link has been sent' };
   }


   async resetPassword(dto: ResetPasswordDTO) {
      this.pinoLogger.info('resetPassword attempt started');

      const { token, newPassword, confirmPassword } = dto;

      if (newPassword !== confirmPassword) {
         this.pinoLogger.warn('Passwords do not match');
         throw new BadRequestException('Passwords do not match');
      }

      let userId: string | null;
      try {
         userId = await this.redis.get(`fp:${token}`);
      } catch (err) {
         const message = err instanceof Error ? err.message : String(err);
         this.pinoLogger.error(`Redis unavailable for reset password`, { token, error: message });
         this.logger.error(`Redis unavailable for reset password: ${message}`);
         throw new ServiceUnavailableException('Unable to process request, please try again');
      }

      if (!userId) {
         this.pinoLogger.error(`Invalid or expired token`);
         throw new BadRequestException('Invalid or expired token');
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
         this.pinoLogger.error(`User not found`);
         throw new NotFoundException('User not found');
      }

      // Hash first — if this fails, token stays valid so user can retry
      const hashed = await this.helper.hashValue(newPassword, 'new password');

      // Write new password
      await this.userService.updateUser(userId, { password: hashed });

      // Delete token only after successful password update
      // If del fails it's non-critical — token TTL (15m) will clean it up
      this.redis.del(`fp:${token}`).catch((err) => {
         this.pinoLogger.error(`Failed to delete reset token from Redis: ${err.message}`);
         this.logger.warn(`Failed to delete reset token from Redis: ${err.message}`)
      });

      return { message: 'Password reset successfully' };
   }
}