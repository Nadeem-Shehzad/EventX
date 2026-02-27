import { IsEnum, IsNotEmpty } from "class-validator";
import { EventVisibility } from "../../enums/event.enums";
import { ApiProperty } from "@nestjs/swagger";


export class EventVisibilityDTO {
   @IsEnum(EventVisibility, { message: 'visibility must be one of public or private' })
   @IsNotEmpty({ message: 'visibility is required' })
   @ApiProperty({ example: 'public' })
   visibility: string
}