import { UserEvent } from "./event.type";
export declare class UserBooking {
    id: string;
    amount: number;
    quantity: number;
    status: string;
    eventId: string;
    event?: UserEvent;
}
