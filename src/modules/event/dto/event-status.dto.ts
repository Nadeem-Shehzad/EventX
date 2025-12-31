import { IsEnum, IsNotEmpty } from "class-validator";
import { EventStatus } from "../enums/event.enums";


export class EventStatusDTO {
   @IsEnum(EventStatus, { message: 'status must be one of draft, published, cancelled, completed' })
   @IsNotEmpty({ message: 'status is required' })
   status: EventStatus
}