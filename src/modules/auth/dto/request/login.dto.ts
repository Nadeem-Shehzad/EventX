import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDTO {
   @IsNotEmpty({ message: 'Email Required' })
   @IsEmail()
   @Transform(({ value }) => value?.trim().toLowerCase())
   @ApiProperty({ example: 'kashif@gmail.com' })
   email: string

   @IsNotEmpty({ message: 'Password Required.' })
   @IsString()
   @Transform(({ value }) => value?.trim())
   @ApiProperty({ example: 'Abc123456' })
   password: string
}
