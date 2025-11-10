import { Expose, Transform } from "class-transformer";


export class UserResponseDTO {
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   readonly _id: string;

   @Expose()
   readonly name: string;

   @Expose()
   readonly email: string;

   @Expose()
   readonly role: string;

   @Expose()
   readonly isVerified: boolean;
}