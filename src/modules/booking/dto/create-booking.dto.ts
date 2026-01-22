import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsMongoId, Min } from "class-validator";


export class CreateBookingDTO {
   @IsMongoId()
   @ApiProperty({ example: 'djhkshfjkdfh1jh2' })
   eventId: string;

   @IsMongoId()
   @ApiProperty({ example: 'djhkshfjkdfhsghg' })
   ticketTypeId: string;

   @IsInt()
   @Min(1)
   @ApiProperty({ example: 1 })
   quantity: number;
}