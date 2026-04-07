import { Ticket } from "./ticket.type";
import { Organizer } from "./organizer.type";
export declare class BannerImage {
    url: string;
    publicId: string;
}
export declare class Event {
    id: string;
    title: string;
    capacity: number;
    startDateTime: string;
    endDateTime: string;
    registrationDeadline: string;
    bannerImage: BannerImage;
    isPaid: boolean;
    eventType: string;
    ticket?: Ticket[];
    organizer?: Organizer;
    organizerId: string;
}
