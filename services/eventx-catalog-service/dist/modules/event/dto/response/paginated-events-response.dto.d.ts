import { EventResponseDTO } from "./event-response.dto";
export declare class PaginatedMetaDTO {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginatedEventsResponseDTO {
    success: boolean;
    statusCode: number;
    data: EventResponseDTO[];
    meta: PaginatedMetaDTO;
}
