import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class ChangePasswordDTO {
   @IsNotEmpty({ message: 'Current password is required.' })
   @IsString()
   @ApiProperty({ example: 'Abc123456' })
   currentPassword: string

   @IsNotEmpty({ message: 'New password is required.' })
   @IsString()
   @MinLength(6, { message: 'New password must be at least 6 characters long.' })
   @ApiProperty({ example: 'Abc112233' })
   newPassword: string

   @IsNotEmpty({ message: 'New password is required.' })
   @IsString()
   @ApiProperty({ example: 'Abc112233' })
   confirmPassword: string
}