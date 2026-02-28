import { ApiProperty } from "@nestjs/swagger";

class CreateEventDataDTO {
   @ApiProperty({ example: '65fae9c1c12a9b0012345678' })
   eventId: string;

   @ApiProperty({ example: 'Event Created Successfully' })
   message: string
}


export class CreateEventResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 201 })
   statusCode: number

   @ApiProperty({ type: CreateEventDataDTO })
   data: CreateEventDataDTO
}