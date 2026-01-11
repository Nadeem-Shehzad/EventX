import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { BookingStatus } from '../enum/booking-status.enum';

export class BookingQueryDTO {
   @IsOptional()
   @IsMongoId()
   userId?: string;

   @IsOptional()
   @IsMongoId()
   eventId?: string;

   @IsOptional()
   @IsEnum(BookingStatus)
   status?: BookingStatus;

   @IsOptional()
   @IsDate()
   @Type(() => Date)
   dateFrom?: Date;

   @IsOptional()
   @IsDate()
   @Type(() => Date)
   dateTo?: Date;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   page?: number = 1;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   limit?: number = 10;
}