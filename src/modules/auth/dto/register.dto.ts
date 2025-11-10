import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


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
   password: string

   @IsOptional()
   @IsString()
   role?: string;
}