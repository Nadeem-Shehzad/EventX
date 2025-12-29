import {
   BadRequestException,
   ConflictException,
   Injectable,
   Logger,
   NotFoundException,
   UnauthorizedException
} from "@nestjs/common";

import { RegisterDTO } from "./dto/register.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { UserResponseDTO } from "../user/dto/user-response.dto";
import { plainToInstance } from "class-transformer";
import { LoginDTO } from "./dto/login.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { randomBytes } from "crypto";
import { RedisService } from "src/redis/redis.service";
import { ResetPasswordDTO } from "./dto/reset-password.dto";


@Injectable()
export class AuthService {

   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly mailService: MailerService,
      private readonly redis: RedisService,
   ) { }

   private readonly logger = new Logger(AuthService.name);

   async register(data: RegisterDTO) {

      const userExists = await this.userService.getUserByEmail(data.email);
      if (userExists) {
         throw new ConflictException('Email already Exists!');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const registerData = {
         ...data,
         password: hashedPassword
      }

      await this.userService.createUser(registerData);

      const user = await this.userService.getUserByEmail(data.email);
      if (!user) {
         throw new NotFoundException('User not found.');
      }

      const userObject = user.toObject();

      return plainToInstance(UserResponseDTO, userObject, {
         excludeExtraneousValues: true,
      });
   }


   async login(loginData: LoginDTO) {
      //this.logger.log(`Login Attempts ...`);
      const user = await this.userService.getUserByEmailWithPassword(loginData.email);
      if (!user) {
         throw new NotFoundException('User not Registered!');
      }

      const passwordMatched = await bcrypt.compare(loginData.password, user.password);
      if (!passwordMatched) {
         throw new UnauthorizedException('Invalid Password!');
      }

      const payload = {
         id: String(user._id),
         name: user.name,
         email: user.email,
         role: user.role
      }

      const token = this.jwtService.sign(payload);

      const refreshToken = this.jwtService.sign(payload, {
         secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
         expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') as JwtSignOptions['expiresIn'],
      });

      await this.userService.updateUser(user._id, {
         refreshToken: await bcrypt.hash(refreshToken, 10)
      });

      return {
         token,
         refreshToken
      };
   }


   async changePassword(id: string, cpData: ChangePasswordDTO) {
      const user = await this.userService.findUserByIDWithPassword(id);
      if (!user) {
         throw new NotFoundException('User not Found.');
      }

      const passwordMatched = await bcrypt.compare(cpData.currentPassword, user.password);
      if (!passwordMatched) {
         throw new UnauthorizedException('Invalid current password.');
      }

      if (cpData.currentPassword === cpData.newPassword) {
         throw new ConflictException('New password must be different from current password.');
      }

      if (cpData.newPassword !== cpData.confirmPassword) {
         throw new BadRequestException('New and Confirm password are not same.');
      }

      const newHashedPassword = await bcrypt.hash(cpData.newPassword, 10);

      await this.userService.updateUser(user._id, {
         password: newHashedPassword
      });

      return 'Password Changed Successfully.';
   }


   async logout(id: string) {
      await this.userService.removeUserToken(id);
      return { loggedOut: true };
   }


   async refreshToken(userData: any, rf_Token: string) {

      const user = await this.userService.getUserByIdWithRefreshToken(userData.id);
      if (!user) {
         throw new NotFoundException('User not found!');
      }

      const isValid = await bcrypt.compare(rf_Token, user.refreshToken);
      if (!isValid) {
         throw new UnauthorizedException('Invalid refresh token!');
      }

      const newPayload = {
         id: String(user._id),
         name: user.name,
         email: user.email,
         role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload);

      const newRefreshToken = this.jwtService.sign(newPayload, {
         secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
         expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
      } as any);

      const hashed = await bcrypt.hash(newRefreshToken, 10);

      await this.userService.updateUser(user._id, {
         refreshToken: hashed
      });

      return {
         access_token: accessToken,
         refresh_token: newRefreshToken,
      };
   }


   async sendVerificationEmail(id: string, email: string) {
      const token = await this.jwtService.signAsync(
         { id: id },
         { expiresIn: '15m' }
      );

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/verify-email?token=${token}`;

      await this.mailService.sendMail({
         to: email,
         subject: 'Verify Your Email',
         html: `
         <h2>Email Verification</h2>
         <p>Click below to verify your email:</p>
         <a href="${url}">${url}</a>
      `
      });
   }


   async verifyEmail(token: string) {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getUserById(payload.id);
      if (!user) {
         throw new NotFoundException('User not found.')
      }

      if (user.isVerified) {
         return { message: 'Email Already Verified.' }
      }

      await this.userService.updateUser(user._id, { isVerified: true });

      return { message: 'Email verified successfully.' }
   }


   async forgotPassword(email: string) {
      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new NotFoundException('User not Found.');


      const token = randomBytes(32).toString('hex');
      const userId = String(user._id);

      await this.redis.set(`fp:${token}`, userId, 60 * 15);

      const APP_URL = this.configService.get<string>('app_url');
      const url = `${APP_URL}/auth/reset-password?token=${token}`;

      await this.mailService.sendMail({
         to: email,
         subject: 'Reset Your Password',
         html: `
         <h2>Reset Password</h2>
         <p>Click below to reset your passwird:</p>
         <a href="${url}">${url}</a>`
      });

      return { token, message: 'Token sent to Your Given Email.' };
   }


   async resetPassword(dto: ResetPasswordDTO) {
      const { token, newPassword, confirmPassword } = dto;
      if (newPassword !== confirmPassword) {
         throw new BadRequestException("Passwords do not match.");
      }

      const userId = await this.redis.get(`fp:${token}`);
      if (!userId) {
         throw new BadRequestException("Invalid or expired token.");
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
         throw new NotFoundException("User not found.");
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await this.userService.updateUser(userId, { password: hashed });

      await this.redis.del(`fp:${token}`);

      return { message: "Password reset successfully." };
   }
}