import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";


export class ImageResponseDTO {
   @Expose()
   @ApiProperty({ example: 'http://example.com/user/pic.gif' })
   url: string;

   @Expose()
   @ApiProperty({ example: 'user/pic.gif' })
   publicId: string;
}


export class UserResponseDTO {
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   @ApiProperty({ example: 'skjfhsjhfkajsh12j4' })
   readonly _id: string;

   @Expose()
   @ApiProperty({ example: 'kashif' })
   readonly name: string;

   @Expose()
   @ApiProperty({ example: 'kashif@gmail.com' })
   readonly email: string;

   @Expose()
   @Type(() => ImageResponseDTO)
   @ApiProperty({ type: ImageResponseDTO })
   readonly image: ImageResponseDTO;

   @Expose()
   @ApiProperty({ example: 'user' })
   readonly role: string;

   @Expose()
   @ApiProperty({ example: 'false' })
   readonly isVerified: boolean;
}