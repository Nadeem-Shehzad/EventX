import { BookingStatus } from '../enum/booking-status.enum';
export declare class BookingQueryDTO {
    userId?: string;
    eventId?: string;
    status?: BookingStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
}
