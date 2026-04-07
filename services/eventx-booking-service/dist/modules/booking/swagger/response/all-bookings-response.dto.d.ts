import { BookingResponseDTO } from "../../dto/booking.response.dto";
export declare class PaginatedMetaDTO {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginatedBookingsResponseDTO {
    success: boolean;
    statusCode: number;
    data: BookingResponseDTO[];
    meta: PaginatedMetaDTO;
}
