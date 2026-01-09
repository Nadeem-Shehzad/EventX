import { IsInt, IsMongoId, Min } from "class-validator";


export class CreateBookingDTO {
   @IsMongoId()
   eventId: string;

   @IsMongoId()
   ticketTypeId: string;

   @IsInt()
   @Min(1)
   quantity: string;
}