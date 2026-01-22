import { ApiProperty } from "@nestjs/swagger";


class EventSummaryDTO {
   @ApiProperty({ example: 10 })
   total: number

   @ApiProperty({ example: 'published' })
   status: string
}


export class EventsStatusSummaryResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 200 })
   statusCode: number;

   @ApiProperty({ type: EventSummaryDTO })
   data: EventSummaryDTO;
}