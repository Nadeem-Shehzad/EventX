import { Transform, Type } from "class-transformer";
import {
   IsArray, IsBoolean, IsDate, IsEnum,
   IsNotEmpty, IsNumber, IsOptional,
   IsString, Min, MinLength, ValidateNested
} from "class-validator";
import { EventStatus, EventType, EventVisibility } from "../enums/event.enums";
import { LocationDTO } from "./location.dto";
import { PriceRangeDTO } from "./price.dto";


export class CreateEventDTO {

   @IsNotEmpty()
   @IsString()
   @MinLength(3)
   @Transform(({ value }) => value?.trim())
   title: string

   @IsNotEmpty()
   @IsString()
   @MinLength(15)
   @Transform(({ value }) => value?.trim())
   description: string

   @IsNotEmpty()
   @IsString()
   category: string

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   tags: string

   @IsEnum(EventType)
   eventType: EventType

   @IsOptional()
   @IsString()
   @Transform(({ value }) => value?.trim())
   bannerImage: string

   @Type(() => Date)
   @IsDate()
   startDateTime: Date

   @Type(() => Date)
   @IsDate()
   endDateTime: Date

   @IsNotEmpty()
   @IsString()
   timezone: string

   @IsOptional()
   @ValidateNested()
   @Type(() => LocationDTO)
   location?: LocationDTO

   @IsEnum(EventStatus)
   status: EventStatus

   @IsEnum(EventVisibility)
   visibility: EventVisibility

   @Type(() => Number)
   @IsNumber()
   @Min(1)
   capacity: number

   @IsOptional()
   @Type(() => Date)
   @IsDate()
   registrationDeadline: Date

   @IsOptional()
   @IsBoolean()
   isPaid: boolean

   @IsOptional()
   @ValidateNested()
   @Type(() => PriceRangeDTO)
   priceRange?: PriceRangeDTO
}