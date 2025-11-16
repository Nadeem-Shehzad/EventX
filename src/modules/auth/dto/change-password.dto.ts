import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class ChangePasswordDTO {
   @IsNotEmpty({ message: 'Current password is required.' })
   @IsString()
   currentPassword: string

   @IsNotEmpty({ message: 'New password is required.' })
   @IsString()
   @MinLength(6, { message: 'New password must be at least 6 characters long.' })
   newPassword: string

   @IsNotEmpty({ message: 'New password is required.' })
   @IsString()
   confirmPassword: string
}