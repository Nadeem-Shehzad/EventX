import { IsEnum, IsNotEmpty } from "class-validator";
import { EventVisibility } from "../enums/event.enums";


export class EventVisibilityDTO {
   @IsEnum(EventVisibility, { message: 'visibility must be one of public or private' })
   @IsNotEmpty({ message: 'visibility is required' })
   visibility: string
}