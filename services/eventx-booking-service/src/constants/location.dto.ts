
import { ApiProperty } from '@nestjs/swagger';
import {
   IsString,
   IsOptional,
   IsNumber,
} from 'class-validator';

export class LocationDTO {

   @IsString()
   @ApiProperty({example: 'Expo Center Lahore'})
   venueName: string;

   @IsString()
   @ApiProperty({example: 'Wapda Town'})
   address: string;

   @IsString()
   @ApiProperty({example: 'Lahore'})
   city: string;

   @IsString()
   @ApiProperty({example: 'Pakistan'})
   country: string;

   @IsOptional()
   @IsNumber()
   @ApiProperty({example: 123.456})
   latitude?: number;

   @IsOptional()
   @IsNumber()
   @ApiProperty({example: 100.200})
   longitude?: number;
}
