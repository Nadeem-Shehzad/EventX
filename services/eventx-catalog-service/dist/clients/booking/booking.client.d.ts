import { HttpService } from "@nestjs/axios";
export declare class BookingClient {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    findBookingById(bookingId: String): Promise<any>;
}
