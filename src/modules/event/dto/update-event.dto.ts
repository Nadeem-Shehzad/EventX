import { IsOptional, IsString, IsNumber, Min, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateEventDTO } from "./create-event.dto";
import { Type } from "class-transformer";

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
   _id?: string;

   @IsOptional()
   @IsString()
   name?: string;

   @IsOptional()
   @IsNumber()
   @Min(0)
   totalQuantity?: number;

   @IsOptional()
   @IsNumber()
   @Min(0)
   price?: number;

   @IsOptional()
   @IsBoolean()
   isPaidEvent?: boolean;

   @IsOptional()
   @IsString()
   currency?: string;
}