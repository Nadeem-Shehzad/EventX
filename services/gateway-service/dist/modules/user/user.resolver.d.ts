import { UserService } from "./user.service";
import { User } from "./dto/user.type";
export declare class UserResolver {
    private userService;
    constructor(userService: UserService);
    user(id: string): Promise<any>;
    userBookings(user: User, page?: number, limit?: number): Promise<never[] | {
        bookings: any;
        meta: any;
    }>;
}
