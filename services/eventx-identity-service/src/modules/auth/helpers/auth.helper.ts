import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthHelper {

   constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
   ) { }

   public async hashValue(value: string, context: string): Promise<string> {
      try {
         return await bcrypt.hash(value, 10);
      } catch {
         throw new InternalServerErrorException(`Failed to process ${context}`);
      }
   }

   public async compareValue(
      plain: string,
      hashed: string,
      context: string,
   ): Promise<boolean> {
      try {
         return await bcrypt.compare(plain, hashed);
      } catch {
         throw new InternalServerErrorException(`Failed to verify ${context}`);
      }
   }

   public buildPayload(user: any) {
      return {
         id: String(user._id),
         name: user.name,
         email: user.email,
         role: user.role,
      };
   }

   public signAccessToken(payload: object): string {
      try {
         return this.jwtService.sign(payload);
      } catch {
         throw new InternalServerErrorException('Failed to sign access token');
      }
   }

   public signRefreshToken(payload: object): string {
      try {
         return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>(
               'JWT_REFRESH_EXPIRES',
            ) as JwtSignOptions['expiresIn'],
         });
      } catch {
         throw new InternalServerErrorException('Failed to sign refresh token');
      }
   }
}