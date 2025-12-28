
import {
   IsString,
   IsNumber,
} from 'class-validator';

export class PriceRangeDTO {

   @IsNumber()
   min: number;

   @IsNumber()
   max: number;

   @IsString()
   currency: string;
}
