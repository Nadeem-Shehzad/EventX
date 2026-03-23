import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { BaseRepository } from "src/common/base/base.repository";
import { throwDbException } from "src/common/utils/db-error.util";


@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {

   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>
   ) { super(userModel) }


   async findAllUsers() {
      try {
         return await this.withTimeout(
            this.userModel.find({ role: 'user' })
         );

      } catch (error) {
         throwDbException(error, 'UserRepository.findByEmailWithPassword');
      }
   }


   async findUserById(id: string) {
      return await this.findById(id);
   }


   async findByIDWithPassword(id: string): Promise<UserDocument | null> {
      try {
         return await this.withTimeout(
            this.userModel.findById(id).select('+password').exec()
         );

      } catch (error) {
         throwDbException(error, 'UserRepository.findByEmailWithPassword');
      }
   }


   async findByEmail(email: string): Promise<UserDocument | null> {
      return await this.findOne({ email });
   }


   async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
      try {
         return await this.withTimeout(
            this.userModel.findOne({ email }).select('+password').exec()
         );

      } catch (error) {
         throwDbException(error, 'UserRepository.findByEmailWithPassword');
      }
   }


   async findByIdWithRefreshToken(id: string) {
      try {
         return await this.withTimeout(
            this.userModel.findById(id).select('+refreshToken').exec()
         );

      } catch (error) {
         throwDbException(error, 'UserRepository.findByIdWithRefreshToken');
      }
   }


   async update(id: any, dataToUpdate: any): Promise<UserDocument | null> {
      return this.updateOne({ _id: id }, dataToUpdate);
   }


   async removeToken(id: any) {
      this.updateOne({ _id: id }, { refreshToken: null } as any);
      return true;
   }


   async removeAccount(id: string): Promise<boolean> {
      return await this.deleteOne({ _id: id });
   }
}