import { BookingService } from "./booking.service";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { BookingQueryDTO } from "./dto/booking-query.dto";
import { BookingResponseDTO } from "./dto/booking.response.dto";
export declare class BookingController {
    private readonly service;
    constructor(service: BookingService);
    createBooking(userId: string, dto: CreateBookingDTO): Promise<{
        bookingId: string;
        status: string;
    }>;
    getAllBookings(page?: number, limit?: number): Promise<any>;
    getBookingsByFilter(query: BookingQueryDTO): Promise<{
        bookings: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOneBooking(id: string): Promise<BookingResponseDTO>;
    getEventBookings(eventId: string, page?: number, limit?: number): Promise<any>;
    getUserBookings(userId: string, page?: number, limit?: number): Promise<{
        bookings: BookingResponseDTO;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserBookings_Internal(id: string, page: number, limit: number, apiKey: string): Promise<{
        bookings: BookingResponseDTO;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getBookingInternal(id: string, apiKey: string): Promise<BookingResponseDTO>;
}
