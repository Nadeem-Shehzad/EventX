import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CursorPaginationDTO {
   @IsOptional()
   @IsString()
   cursor?: string; // last item's _id from previous page

   @IsOptional()
   @IsInt()
   @Min(1)
   limit?: number = 10;
}