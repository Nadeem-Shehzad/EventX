import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../request-context.service';
export declare class RequestIdMiddleware implements NestMiddleware {
    private readonly context;
    constructor(context: RequestContextService);
    use(req: Request, res: Response, next: NextFunction): void;
}
