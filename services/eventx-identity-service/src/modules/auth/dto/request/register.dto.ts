import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";


export class ImageDTO {
   @IsString()
   @ApiProperty({ example: 'http://example.com/user/pic.gif' })
   url: string;

   @IsString()
   @ApiProperty({ example: 'user/pic.gif' })
   publicId: string;
}


export class RegisterDTO {
   @IsNotEmpty({ message: 'Name is Required!' })
   @IsString()
   @MinLength(3, { message: 'Name must be at least 3 characters!' })
   @MaxLength(22, { message: 'Name must not exceed 22 characters!' })
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: 'Kashif' })
   name: string

   @IsNotEmpty({ message: 'Email Required!' })
   @IsEmail()
   @Transform(({ value }) => value?.trim().toLowerCase())
   @ApiProperty({ example: 'kashif@gmail.com' })
   email: string

   @IsNotEmpty({ message: 'Password Required!' })
   @IsString()
   @MinLength(6, { message: 'Password must be at least 6 characters long!' })
   @MaxLength(22, { message: 'Password must not exceed 22 characters!' })
   @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
   @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
   @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
   @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character.' })
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: '$Abc123456' })
   password: string

   @IsOptional()
   @Transform(({ value }) => {
      if (!value) return undefined;

      if (typeof value === 'string') {
         try {
            return JSON.parse(value);
         } catch (e) {
            throw new Error('Invalid JSON format');
         }
      }
      return value;
   })
   @ValidateNested()
   @Type(() => ImageDTO)
   @ApiProperty({ type: ImageDTO })
   image: ImageDTO;

   @IsOptional()
   @IsString()
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: 'user' })
   role?: string;
}