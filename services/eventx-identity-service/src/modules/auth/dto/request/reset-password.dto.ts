import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class ResetPasswordDTO {
   @IsNotEmpty()
   @IsString()
   @ApiProperty({ example: 'sdjhksjdhfjksdfh.akjfhsjhfskdjfh.skdjfhdjhkksdj' })
   token: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ example: '$Abc123456' })
   newPassword: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ example: '$Abc123456' })
   confirmPassword: string;
}