import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsArray, IsNumber, Min } from 'class-validator';

export class EventQueryDTO {
   @IsOptional()
   @IsString()
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
   tags?: string[];

   @IsOptional()
   @IsString()
   city?: string;

   @IsOptional()
   @IsString()
   search?: string;

   @IsOptional()
   @IsNumber()
   @Min(1)
   @Type(() => Number)
   page?: number = 1;

   @IsOptional()
   @IsNumber()
   @Type(() => Number)
   limit?: number = 10;
}