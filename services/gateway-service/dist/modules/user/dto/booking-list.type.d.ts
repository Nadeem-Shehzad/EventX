import { UserBooking } from "./booking.type";
export declare class BookingMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class UserBookingsList {
    bookings: UserBooking[];
    meta: BookingMeta;
}
