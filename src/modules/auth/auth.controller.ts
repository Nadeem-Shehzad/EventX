import { Body, Controller, Get, Post, } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";


@Controller('auth')
export class AuthController {

   constructor(private readonly authService: AuthService) { }

   @Post('register')
   async register(@Body() data: RegisterDTO) {
      return this.authService.register(data);
   }

   @Get()
   async allUsers() {
      return this.authService.getAllUsers();
   }
}