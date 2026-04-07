import { ConfigService } from '@nestjs/config';
export declare class HttpService {
    private configService;
    constructor(configService: ConfigService);
    get(url: string): Promise<any>;
}
