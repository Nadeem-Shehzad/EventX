import { ApiProperty } from "@nestjs/swagger";


class VisibilitySummaryDTO {
   @ApiProperty({ example: 10 })
   total: number

   @ApiProperty({ example: 'public' })
   visibility: string
}


export class EventsVisibilitySummaryResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 200 })
   statusCode: number;

   @ApiProperty({ type: VisibilitySummaryDTO })
   data: VisibilitySummaryDTO;
}