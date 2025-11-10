import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterDTO } from "./dto/register.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { UserResponseDTO } from "../user/dto/user-response.dto";
import { plainToInstance } from "class-transformer";


@Injectable()
export class AuthService {

   constructor(private readonly userService: UserService) { }

   async register(data: RegisterDTO) {

      const userExists = await this.userService.findByEmail(data.email);
      if (userExists) {
         throw new ConflictException('Email already Exists!');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const registerData = {
         ...data,
         password: hashedPassword
      }

      await this.userService.create(registerData);

      const user = await this.userService.findByEmail(data.email);
      // 2. THIS IS THE KEY CHANGE
      // Use plainToInstance to create the DTO from the plain user object.
      // It will automatically respect your @Expose and @Transform decorators.
      return plainToInstance(UserResponseDTO, user?.toObject(), {

         // This is crucial: it strips away any properties not
         // marked with @Expose (like the user's password).
         excludeExtraneousValues: true,
      });
   }

   async getAllUsers() {
      return 'Currently there is no User.';
   }
}