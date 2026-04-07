import { CreateEventDTO } from "./create-event.dto";
declare const UpdateEventDTO_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateEventDTO, "ticketTypes">>>;
export declare class UpdateEventDTO extends UpdateEventDTO_base {
    ticketTypes?: UpdateTicketTypeDto[];
}
export declare class UpdateTicketTypeDto {
    _id?: string;
    name?: string;
    totalQuantity?: number;
    price?: number;
    isPaidEvent?: boolean;
    currency?: string;
}
export {};
