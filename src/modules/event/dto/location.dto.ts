
import {
   IsString,
   IsOptional,
   IsNumber,
} from 'class-validator';

export class LocationDTO {

   @IsString()
   venueName: string;

   @IsString()
   address: string;

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
