import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDTO {
   @IsNotEmpty({ message: 'Email Required' })
   @IsEmail()
   @Transform(({ value }) => value?.trim().toLowerCase())
   email: string

   @IsNotEmpty({ message: 'Password Required.' })
   @IsString()
   @Transform(({ value }) => value?.trim())
   password: string
}
