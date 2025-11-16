import { IsNotEmpty, IsString } from "class-validator";


export class ResetPasswordDTO {
   @IsNotEmpty()
   @IsString()
   token: string;

   @IsNotEmpty()
   @IsString()
   newPassword: string;

   @IsNotEmpty()
   @IsString()
   confirmPassword: string;
}