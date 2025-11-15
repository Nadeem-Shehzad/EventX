import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class JwtAuthGuard implements CanActivate {

   constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService
   ) { }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractToken(request);
      if (!token) {
         throw new UnauthorizedException('Authorization token missing');
      }

      try {
         const secret = this.configService.get<string>('JWT_SECRET');
         const payload = await this.jwtService.verifyAsync(token, { secret });

         request['user'] = payload;
         return true;

      } catch (error) {
         throw new UnauthorizedException('Invalid or expired token.');
      }
   }

   private extractToken(request: Request): string | null {
      const authHeader = request.headers.authorization;
      if (!authHeader) return null;

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) return null;

      return token;
   }
}