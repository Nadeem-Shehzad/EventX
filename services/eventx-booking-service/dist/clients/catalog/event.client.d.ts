import { HttpService } from "@nestjs/axios";
export declare class EventClient {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    findEventById(eventId: String): Promise<any>;
}
