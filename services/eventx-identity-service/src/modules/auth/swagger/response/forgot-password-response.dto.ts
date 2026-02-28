import { ApiProperty } from "@nestjs/swagger";


export class ForgotPasswordResponseDTO {
   @ApiProperty({ example: 'sjkhfsjkdhsjkdhf.ashdakjshdakjdhajhsd.lshfksjdhfskjdhf' })
   token: string;

   @ApiProperty({ example: 'Token sent to Your Given Email.' })
   message: string;
}