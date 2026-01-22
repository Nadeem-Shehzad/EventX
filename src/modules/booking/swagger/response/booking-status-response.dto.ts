import { ApiProperty } from "@nestjs/swagger";


export class BookingStatusResponseDTO {
   @ApiProperty({ example: true })
   status: boolean
}