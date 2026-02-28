import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class JwtRefreshTokenGuard implements CanActivate {

   constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService
   ) { }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.body.refresh_token;
      if (!token) {
         throw new UnauthorizedException('Ref-Token is missing!');
      }

      try {
         const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
         const payload = await this.jwtService.verifyAsync(token, { secret });

         request['user'] = payload;
         request['rf_Token'] = token;
         return true;

      } catch (error) {
         throw new UnauthorizedException('Ref-Token is missing or expired!');
      }
   }
}