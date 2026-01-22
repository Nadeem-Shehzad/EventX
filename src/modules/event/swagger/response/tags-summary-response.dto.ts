import { ApiProperty } from "@nestjs/swagger";


class TagsSummaryDTO {
   @ApiProperty({ example: 10 })
   total: number

   @ApiProperty({ example: 'public' })
   tags: string
}


export class EventsTagsSummaryResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 200 })
   statusCode: number;

   @ApiProperty({ type: TagsSummaryDTO })
   data: TagsSummaryDTO;
}