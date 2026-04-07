import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
export declare class AuthHelper {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    hashValue(value: string, context: string): Promise<string>;
    compareValue(plain: string, hashed: string, context: string): Promise<boolean>;
    buildPayload(user: any): {
        id: string;
        name: any;
        email: any;
        role: any;
    };
    signAccessToken(payload: object): string;
    signRefreshToken(payload: object): string;
}
