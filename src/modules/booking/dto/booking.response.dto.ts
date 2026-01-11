import { Expose, Transform } from "class-transformer";


export class BookingResponseDTO {
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   _id: string;

   @Expose()
   @Transform(({ obj }) => obj.userId.toString())
   userId: string

   @Expose()
   @Transform(({ obj }) => obj.eventId.toString())
   eventId: string

   @Expose()
   amount: number

   @Expose()
   quantity: number

   @Expose()
   status: string

   @Expose()
   currency: string
}