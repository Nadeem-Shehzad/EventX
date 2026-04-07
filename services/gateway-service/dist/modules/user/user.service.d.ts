import { HttpService } from "../../common/http/http.service";
export declare class UserService {
    private http;
    constructor(http: HttpService);
    getUser(id: string): Promise<any>;
    getBookings(id: string, page?: number, limit?: number): Promise<never[] | {
        bookings: any;
        meta: any;
    }>;
}
