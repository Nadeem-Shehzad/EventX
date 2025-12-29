import { Expose, Transform, Type } from "class-transformer";


export class ImageResponseDTO {
   @Expose()
   url: string;

   @Expose()
   publicId: string;
}


export class UserResponseDTO {
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   readonly _id: string;

   @Expose()
   readonly name: string;

   @Expose()
   readonly email: string;

   @Expose()
   @Type(() => ImageResponseDTO)
   readonly image: ImageResponseDTO;

   @Expose()
   readonly role: string;

   @Expose()
   readonly isVerified: boolean;
}