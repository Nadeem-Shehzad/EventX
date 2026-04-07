import { INestApplication } from "@nestjs/common";
export declare const registerTestUser: (app: INestApplication, overrideData?: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
}>) => Promise<{
    _id: any;
    name: string;
    email: string;
    password: string;
    role: string;
}>;
export declare const loginTestUser: (app: INestApplication, overrideData?: Partial<{
    email: string;
    password: string;
}>) => Promise<import("superagent/lib/node/response")>;
