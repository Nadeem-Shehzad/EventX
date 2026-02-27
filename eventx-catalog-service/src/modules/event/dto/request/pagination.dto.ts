import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";


export class PaginationDTO {
   @IsOptional()
   @Type(() => Number)
   @IsInt()
   @Min(1)
   @ApiPropertyOptional({ example: 1, description: 'data page no' })
   page: number = 1

   @IsOptional()
   @Type(() => Number)
   @IsInt()
   @Min(1)
   @Max(25)
   @ApiPropertyOptional({ example: 10, description: 'page data limit' })
   limit: number = 10
}