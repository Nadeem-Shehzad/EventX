import { Injectable } from "@nestjs/common";


@Injectable()
export class AuthService {
   async getAllUsers(){
      return 'Currently there is no User.';
   }
}