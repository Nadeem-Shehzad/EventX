import { UserBookingsList } from "./booking-list.type";
declare class UserImage {
    url: string;
    publicId: string;
}
export declare class User {
    id: string;
    name: string;
    email: string;
    role: string;
    image: UserImage;
    isVerified: boolean;
    userBookings?: UserBookingsList;
}
export {};
