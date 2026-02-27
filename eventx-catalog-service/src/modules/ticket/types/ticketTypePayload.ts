import { Types } from "mongoose";

export interface TicketTypePayload {
   name: string;
   eventId: Types.ObjectId;
   totalQuantity: number;
   price: number;
   isPaidEvent: boolean;
   currency: string;
}