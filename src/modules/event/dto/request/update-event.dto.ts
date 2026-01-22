import { IsOptional, IsString, IsNumber, Min, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateEventDTO } from "./create-event.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateEventDTO extends PartialType(
   OmitType(CreateEventDTO, ['ticketTypes'] as const),
) {
   @IsOptional()
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => UpdateTicketTypeDto)
   ticketTypes?: UpdateTicketTypeDto[];
}


export class UpdateTicketTypeDto {
   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'asjhajhdasjhas857n' })
   _id?: string;

   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'Kashif' })
   name?: string;

   @IsOptional()
   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 1 })
   totalQuantity?: number;

   @IsOptional()
   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 1000 })
   price?: number;

   @IsOptional()
   @IsBoolean()
   @ApiProperty({ example: true })
   isPaidEvent?: boolean;

   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'PKR' })
   currency?: string;
}