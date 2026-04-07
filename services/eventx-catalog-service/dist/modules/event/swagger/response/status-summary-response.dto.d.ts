declare class EventSummaryDTO {
    total: number;
    status: string;
}
export declare class EventsStatusSummaryResponseDTO {
    success: boolean;
    statusCode: number;
    data: EventSummaryDTO;
}
export {};
