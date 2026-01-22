import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";


export class BookingResponseDTO {
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   @ApiProperty({ example: 'jsdhfksjfhsdjh123h' })
   _id: string;

   @Expose()
   @Transform(({ obj }) => obj.userId.toString())
   @ApiProperty({ example: 'jsdhfksjfhsdjh1344' })
   userId: string

   @Expose()
   @Transform(({ obj }) => obj.eventId.toString())
   @ApiProperty({ example: 'jsdhfksjfhsdjh12er' })
   eventId: string

   @Expose()
   @ApiProperty({ example: 1000 })
   amount: number

   @Expose()
   @ApiProperty({ example: 2 })
   quantity: number

   @Expose()
   @ApiProperty({ example: 'PENDING' })
   status: string

   @Expose()
   @ApiProperty({ example: 'PKR' })
   currency: string
}