import { TicketTypeDto } from "../request/create-event.dto";
export declare class LocationResponseDTO {
    venueName: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}
export declare class BannerImageResponseDTO {
    url: string;
    publicId: string;
}
export declare class EventResponseDTO {
    _id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly tags: string[];
    readonly eventType: string;
    readonly location?: LocationResponseDTO;
    readonly bannerImage: BannerImageResponseDTO;
    readonly startDateTime: Date;
    readonly endDateTime: Date;
    readonly timezone: string;
    readonly capacity: number;
    readonly registeredCount: number;
    readonly isPaid: boolean;
    ticketTypes?: TicketTypeDto[];
}
