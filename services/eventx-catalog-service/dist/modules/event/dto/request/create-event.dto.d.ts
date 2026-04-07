import { EventStatus, EventType, EventVisibility } from "../../enums/event.enums";
import { LocationDTO } from "../location.dto";
export declare class BannerImageDTO {
    url: string;
    publicId: string;
}
export declare class TicketTypeDto {
    name: string;
    totalQuantity: number;
    price: number;
    isPaidEvent: boolean;
    currency: string;
}
export declare const ToLowerCase: () => PropertyDecorator;
export declare class CreateEventDTO {
    title: string;
    slug?: string;
    description: string;
    category: string;
    tags: string;
    eventType: EventType;
    bannerImage: BannerImageDTO;
    startDateTime: Date;
    endDateTime: Date;
    timezone: string;
    location?: LocationDTO;
    status: EventStatus;
    visibility: EventVisibility;
    capacity: number;
    registrationDeadline: Date;
    isPaid: boolean;
    ticketTypes: TicketTypeDto[];
}
