import { IsEnum, IsNotEmpty } from "class-validator";
import { EventStatus } from "../../enums/event.enums";
import { ApiProperty } from "@nestjs/swagger";


export class EventStatusDTO {
   @IsEnum(EventStatus, { message: 'status must be one of draft, published, cancelled, completed' })
   @IsNotEmpty({ message: 'status is required' })
   @ApiProperty({ example: 'published' })
   status: EventStatus
}