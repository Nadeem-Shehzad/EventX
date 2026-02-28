import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { UserRepository } from "./user.repository";
import { plainToInstance } from "class-transformer";
import { UserResponseDTO } from "./dto/user-response.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class UserService {

   constructor(private readonly userRepo: UserRepository) { }

   private readonly logger = new Logger(UserService.name);


   async getUserProfile(id: string) {
      const user = await this.userRepo.findUserById(id);

      if (!user) {
         throw new NotFoundException('User not found');
      }

      return plainToInstance(UserResponseDTO, user, {
         excludeExtraneousValues: true,
      });
   }


   async getUserDataByID(id: string) {
      const user = await this.userRepo.findUserById(id);

      if (!user) {
         throw new NotFoundException('User not Found!');
      }

      return plainToInstance(UserResponseDTO, user, {
         excludeExtraneousValues: true
      });
   }


   async deleteAccount(id: string) {
      const user = await this.userRepo.findUserById(id);
      if (!user) {
         throw new NotFoundException('User Not Found!');
      }

      const imageId = user.image?.publicId;

      const result = await this.userRepo.removeAccount(id);
      if (!result) {
         throw new NotFoundException('User Not Found!');
      }

      if (imageId) {
         try {
            await cloudinary.uploader.destroy(imageId);
            this.logger.log(`Cloudinary image deleted: ${imageId}`);
         } catch (error) {
            this.logger.error(`Failed to delete image from Cloudinary: ${imageId}`, error.stack);
         }
      }

      return { message: 'Account deleted successfully' };
   }


   async updateProfile(id: string, dataToUpdate: UpdateUserDTO) {
      const user = await this.userRepo.findUserById(id);
      if (!user) {
         throw new NotFoundException('User Not Found!');
      }

      if (dataToUpdate.image && user.image?.publicId) {
         await cloudinary.uploader.destroy(user.image.publicId);
      }

      const result = await this.userRepo.update(id, dataToUpdate);
      if (!result) {
         throw new NotFoundException('User not found');
      }

      return { message: 'Profile updated successfully' };
   }


   async getAllUsers() {
      const users = await this.userRepo.findAllUsers();
      return plainToInstance(UserResponseDTO, users, {
         excludeExtraneousValues: true,
      });
   }



   // user-db - services
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