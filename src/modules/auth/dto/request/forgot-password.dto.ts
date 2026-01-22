import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDTO {
   @IsEmail()
   @IsNotEmpty()
   @ApiProperty({ example: 'kashif@gmail.com' })
   email: string;
}