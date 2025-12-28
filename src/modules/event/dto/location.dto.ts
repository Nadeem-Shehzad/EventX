
import {
   IsString,
   IsOptional,
   IsNumber,
} from 'class-validator';

export class LocationDTO {

   @IsOptional()
   @IsString()
   venueName?: string;

   @IsOptional()
   @IsString()
   address?: string;

   @IsString()
   city: string;

   @IsString()
   country: string;

   @IsOptional()
   @IsNumber()
   latitude?: number;

   @IsOptional()
   @IsNumber()
   longitude?: number;
}
