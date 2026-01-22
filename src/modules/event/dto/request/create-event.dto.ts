import { Transform, Type } from "class-transformer";
import {
   IsArray, IsBoolean, IsDate, IsEnum,
   IsNotEmpty, IsNumber, IsOptional,
   IsString, Min, MinLength, ValidateNested
} from "class-validator";
import { EventStatus, EventType, EventVisibility } from "../../enums/event.enums";
import { LocationDTO } from "../../../../../location.dto";
import { ApiProperty } from "@nestjs/swagger";


export class BannerImageDTO {
   @IsString()
   @ApiProperty({ example: 'https://cdn.eventx.com/banner.jpg', description: 'Banner image URL' })
   url: string;

   @IsString()
   @ApiProperty({ example: 'banner123', description: 'Banner public ID' })
   publicId: string;
}

export class TicketTypeDto {
   @IsString()
   @ApiProperty({ example: 'VIP Ticket', description: 'Ticket name' })
   name: string;

   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 5, description: 'Ticket quantity' })
   totalQuantity: number;

   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 500, description: 'Ticket price' })
   price: number;

   @IsBoolean()
   @ApiProperty({ example: true, description: 'check ticket is paid or free' })
   isPaidEvent: boolean;

   @IsString()
   @ApiProperty({ example: 'PKR', description: 'Ticket price currency' })
   currency: string;
}


export const ToLowerCase = () =>
   Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));


export class CreateEventDTO {

   @IsNotEmpty()
   @IsString()
   @MinLength(3)
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: 'T20 World Cup', description: 'Event title' })
   title: string

   @IsOptional()
   @IsString()
   @ToLowerCase()
   slug?: string

   @IsNotEmpty()
   @IsString()
   @MinLength(15)
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: 'Mega cricket event with teams', description: 'Event description' })
   description: string

   @IsNotEmpty()
   @IsString()
   @ToLowerCase()
   @ApiProperty({ example: 'sports', description: 'Event Category' })
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
   @ApiProperty({ type: [String], example: ['cricket', 'footbal'], description: 'Event Tags' })
   tags: string

   @IsEnum(EventType)
   @ApiProperty({ enum: EventType, example: EventType.OFFLINE, description: 'Event Type' })
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
   @ApiProperty({ type: BannerImageDTO, description: 'Banner Image', required: false })
   bannerImage: BannerImageDTO

   @Type(() => Date)
   @IsDate()
   @ApiProperty({ example: '2026-03-10T18:00:00Z', description: 'Event Start Date' })
   startDateTime: Date

   @Type(() => Date)
   @IsDate()
   @ApiProperty({ example: '2026-03-10T18:00:00Z', description: 'Event Start Date' })
   endDateTime: Date

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ example: 'Asia/Karachi', description: 'Timezone of the event' })
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
      return value;
   })
   @ValidateNested()
   @Type(() => LocationDTO)
   @ApiProperty({ type: LocationDTO, description: 'Event Location', required: false })
   location?: LocationDTO

   @IsEnum(EventStatus)
   @ApiProperty({ enum: EventStatus, example: EventStatus.DRAFT, description: 'Event Status' })
   status: EventStatus

   @IsEnum(EventVisibility)
   @ApiProperty({ enum: EventVisibility, example: EventVisibility.PUBLIC, description: 'Event Visibility' })
   visibility: EventVisibility

   @Type(() => Number)
   @IsNumber()
   @Min(1)
   @ApiProperty({ example: 50, description: 'Event Capacity' })
   capacity: number

   @IsOptional()
   @Type(() => Date)
   @IsDate()
   @ApiProperty({ example: '2026-03-10T18:00:00Z', description: 'Event registration deadline', required: false })
   registrationDeadline: Date

   @IsOptional()
   @IsBoolean()
   @ApiProperty({ example: true, description: 'Whether the event is paid', required: false })
   isPaid: boolean

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => TicketTypeDto)
   @ApiProperty({ type: [TicketTypeDto], description: 'List of ticket types for the event' })
   ticketTypes: TicketTypeDto[];
}
