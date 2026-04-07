declare class CreateEventDataDTO {
    eventId: string;
    message: string;
}
export declare class CreateEventResponseDTO {
    success: boolean;
    statusCode: number;
    data: CreateEventDataDTO;
}
export {};
