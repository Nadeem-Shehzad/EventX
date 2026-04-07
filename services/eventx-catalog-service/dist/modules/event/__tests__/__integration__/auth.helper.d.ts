import { INestApplication } from '@nestjs/common';
export declare const generateTestToken: (app: INestApplication, payload: {
    userId: string;
    email: string;
    role: string;
}) => string;
