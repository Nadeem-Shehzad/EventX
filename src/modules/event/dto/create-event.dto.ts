import { Transform, Type } from "class-transformer";
import {
   IsArray, IsBoolean, IsDate, IsEnum,
   IsNotEmpty, IsNumber, IsOptional,
   IsString, Min, MinLength, ValidateNested
} from "class-validator";
import { EventStatus, EventType, EventVisibility } from "../enums/event.enums";
import { LocationDTO } from "./location.dto";
import { PriceRangeDTO } from "./price.dto";


export class BannerImageDTO {
   @IsString()
   url: string;

   @IsString()
   publicId: string;
}


export const ToLowerCase = () =>
   Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));


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
   @ToLowerCase()
   category: string

   @IsOptional()
   @Transform(({ value }) => {
      if (!value) return [];

      if (typeof value === 'string') {
         try {
            return JSON.parse(value.toLowerCase());
         } catch {
            throw new Error('Tags must be a valid JSON array');
         }
      }
      return value;
   })
   @IsArray()
   @IsString({ each: true })
   tags: string

   @IsEnum(EventType)
   eventType: EventType

   @IsOptional()
   @Transform(({ value }) => {
      if (!value) return undefined;

      if (typeof value === 'string') {
         try {
            return JSON.parse(value);
         } catch (e) {
            throw new Error('Invalid JSON format');
         }
      }
      return value;
   })
   @ValidateNested()
   @Type(() => BannerImageDTO)
   bannerImage: BannerImageDTO

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
   @Transform(({ value }) => {
      if (!value) return undefined;

      if (typeof value === 'string') {
         try {
            return JSON.parse(value);
         } catch (e) {
            throw new Error('Invalid JSON format');
         }
      }

      console.log('RAW LOCATION VALUE:', value);
      return value;
   })
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
   @Transform(({ value }) => {
      if (!value) return undefined;

      if (typeof value === 'string') {
         try {
            return JSON.parse(value);
         } catch (e) {
            throw new Error('Invalid JSON format');
         }
      }
      return value;
   })
   @ValidateNested()
   @Type(() => PriceRangeDTO)
   priceRange?: PriceRangeDTO
}