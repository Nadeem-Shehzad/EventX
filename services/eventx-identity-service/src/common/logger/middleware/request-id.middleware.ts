import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestContextService } from '../request-context.service';


@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
   constructor(private readonly context: RequestContextService) { }

   use(req: Request, res: Response, next: NextFunction) {
      const requestId = (req.headers['x-request-id'] as string) || uuidv4();

      this.context.run({ requestId }, () => {
         res.setHeader('x-request-id', requestId);
         next();
      });
   }
}