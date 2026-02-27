import { ApiProperty } from "@nestjs/swagger";
import { EventResponseDTO } from "./event-response.dto";


export class PaginatedMetaDTO {
   @ApiProperty({ example: 1 })
   page: number

   @ApiProperty({ example: 10 })
   limit: number

   @ApiProperty({ example: 100 })
   total: number

   @ApiProperty({ example: 10 })
   totalPages: number
}


export class PaginatedEventsResponseDTO {
   @ApiProperty({ example: true })
   success: boolean;

   @ApiProperty({ example: 200 })
   statusCode: number;

   @ApiProperty({ type: [EventResponseDTO] })
   data: EventResponseDTO[];

   @ApiProperty({ type: PaginatedMetaDTO })
   meta: PaginatedMetaDTO;
}