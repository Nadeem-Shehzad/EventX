import { Types } from "mongoose";
export declare class CreateTicketDTO {
    name: string;
    eventId: Types.ObjectId;
    totalQuantity: number;
    availableQuantity: number;
    price: number;
    isPaidEvent: boolean;
    currency: string;
}
