import { BannerImage } from "../../event/dto/event.type";
export declare class UserEvent {
    id: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    bannerImage: BannerImage;
    isPaid: boolean;
    eventType: string;
}
