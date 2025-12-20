import { Injectable, Logger } from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { UserRepository } from "./user.repository";


@Injectable()
export class UserService {

   constructor(private readonly userRepo: UserRepository) { }

   private readonly logger = new Logger(UserService.name);

   async createUser(data: Partial<User>): Promise<UserDocument | null> {
      return await this.userRepo.create(data);
   }


   async getUserById(id: string) {
      return await this.userRepo.findUserById(id);
   }


   async findUserByIDWithPassword(id: string): Promise<UserDocument | null> {
      return await this.userRepo.findByIDWithPassword(id);
   }


   async getUserByEmail(email: string): Promise<UserDocument | null> {
      return await this.userRepo.findByEmail(email);
   }


   async getUserByEmailWithPassword(email: string): Promise<UserDocument | null> {
      return await this.userRepo.findByEmailWithPassword(email);
   }


   async getUserByIdWithRefreshToken(id: string) {
      return await this.userRepo.findByIdWithRefreshToken(id);
   }


   async updateUser(id: any, dataToUpdate: any): Promise<UserDocument | null> {
      return await this.userRepo.update(id, dataToUpdate);
   }


   async removeUserToken(id: any) {
      return await this.userRepo.removeToken(id);
   }
}