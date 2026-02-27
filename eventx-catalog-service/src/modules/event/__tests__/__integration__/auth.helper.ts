import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const generateTestToken = (
   app: INestApplication,
   payload: {
      userId: string;
      email: string;
      role: string;
   }
): string => {
   const jwtService = app.get(JwtService);
   return jwtService.sign(payload, {
      secret: 'test-access-secret' // ← pass secret explicitly
   });
};