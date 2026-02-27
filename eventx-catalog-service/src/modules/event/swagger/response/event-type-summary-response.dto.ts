import { ApiProperty } from "@nestjs/swagger";


class EventTypesSummaryDTO {
   @ApiProperty({ example: 10 })
   total: number

   @ApiProperty({ example: 'public' })
   eventType: string
}


export class EventsTypesSummaryResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 200 })
   statusCode: number;

   @ApiProperty({ type: EventTypesSummaryDTO })
   data: EventTypesSummaryDTO;
}