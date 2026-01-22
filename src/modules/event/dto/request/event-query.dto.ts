import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsArray, IsNumber, Min } from 'class-validator';


export class EventQueryDTO {
   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'sports' })
   category?: string;

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   @Transform(({ value }) => {
      if (Array.isArray(value))
         return value;

      if (typeof value === 'string')
         return value.split(',');

      return value;
   })
   @ApiProperty({ example: ['sports', 'tech'] })
   tags?: string[];

   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'lahore' })
   city?: string;

   @IsOptional()
   @IsString()
   @ApiProperty({ example: 'T20 match' })
   search?: string;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   @ApiProperty({ example: 1 })
   page?: number = 1;

   @IsOptional()
   @IsNumber()
   @Type(() => Number)
   @ApiProperty({ example: 10 })
   limit?: number = 10;
}