import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsNumber, IsString, Min } from "class-validator";
import { Types } from "mongoose";


export class CreateTicketDTO {
   @IsString()
   @ApiProperty({ example: 'VIP ticket' })
   name: string

   @IsMongoId()
   @ApiProperty({ example: 'ksdjhfsjdsdjfh64kj5' })
   eventId: Types.ObjectId

   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 100 })
   totalQuantity: number

   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 100 })
   availableQuantity: number

   @IsNumber()
   @Min(0)
   @ApiProperty({ example: 1000 })
   price: number

   @IsBoolean()
   @ApiProperty({ example: true })
   isPaidEvent: boolean

   @IsNumber()
   @ApiProperty({ example: 'PKR' })
   currency: string
}