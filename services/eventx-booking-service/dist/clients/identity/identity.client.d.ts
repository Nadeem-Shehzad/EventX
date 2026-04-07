import { HttpService } from "@nestjs/axios";
export declare class IdentityClient {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    getUserById(userId: string): Promise<{
        name: string;
        email: string;
    } | null>;
}
