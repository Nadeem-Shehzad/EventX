
import { ApiProperty } from '@nestjs/swagger';
import {
   IsString,
   IsNumber,
} from 'class-validator';

export class PriceRangeDTO {

   @IsNumber()
   @ApiProperty({ example: 0 })
   min: number;

   @IsNumber()
   @ApiProperty({ example: 100 })
   max: number;

   @IsString()
   @ApiProperty({ example: 'PKR' })
   currency: string;
}
