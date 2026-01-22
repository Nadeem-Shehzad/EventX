import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { BookingStatus } from '../enum/booking-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BookingQueryDTO {
   @IsOptional()
   @IsMongoId()
   @ApiProperty({ example: 'skjfhsjfhsdkfh76hds' })
   userId?: string;

   @IsOptional()
   @IsMongoId()
   @ApiProperty({ example: 'skjfhsjfhsdkfh76h23' })
   eventId?: string;

   @IsOptional()
   @IsEnum(BookingStatus)
   @ApiProperty({ example: 'PENDING' })
   status?: BookingStatus;

   @IsOptional()
   @IsDate()
   @Type(() => Date)
   @ApiProperty({ example: '2026-03-10T18:00:00Z' })
   dateFrom?: Date;

   @IsOptional()
   @IsDate()
   @Type(() => Date)
   @ApiProperty({ example: '2026-03-10T18:00:00Z' })
   dateTo?: Date;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   @ApiProperty({ example: 1 })
   page?: number = 1;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   @ApiProperty({ example: 10 })
   limit?: number = 10;
}