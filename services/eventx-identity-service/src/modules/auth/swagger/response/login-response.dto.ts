import { ApiProperty } from "@nestjs/swagger";


export class LoginResponseDTO {
   @ApiProperty({ example: 'sjkhfsjkdhsjkdhf.ashdakjshdakjdhajhsd.lshfksjdhfskjdhf' })
   token: string;

   @ApiProperty({ example: 'sjkhfsjkdhsjkdhf.ashdakjshdakjdhajhsd.lshfksjdhfskjdhf' })
   refreshToken: string;
}