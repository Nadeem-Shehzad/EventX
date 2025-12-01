import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class RegisterDTO {
   @IsNotEmpty({ message: 'Name is Required!' })
   @IsString()
   @MinLength(3, { message: 'Name must be at least 3 characters!' })
   @MaxLength(22, { message: 'Name must not exceed 22 characters!' })
   @Transform(({ value }) => value?.trim())
   name: string

   @IsNotEmpty({ message: 'Email Required!' })
   @IsEmail()
   @Transform(({ value }) => value?.trim().toLowerCase())
   email: string

   @IsNotEmpty({ message: 'Password Required!' })
   @IsString()
   @MinLength(6, { message: 'Password must be at least 6 characters long!' })
   @MaxLength(22, { message: 'Password must not exceed 22 characters!' })
   @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
   @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
   @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
   @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character.' })
   password: string

   @IsOptional()
   @IsString()
   role?: string;
}