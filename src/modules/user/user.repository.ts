import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";


@Injectable()
export class UserRepository {

   constructor(@InjectModel('User') private userModel: Model<UserDocument>) { }

   async create(data: Partial<User>): Promise<UserDocument | null> {
      return await this.userModel.create(data);
   }


   async findUserById(id: string) {
      return await this.userModel.findById(id).exec();
   }


   async findByIDWithPassword(id: string): Promise<UserDocument | null> {
      return await this.userModel.findById(id).select('+password').exec();
   }


   async findByEmail(email: string): Promise<UserDocument | null> {
      return await this.userModel.findOne({ email }).exec();
   }


   async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
      return await this.userModel.findOne({ email }).select('+password').exec();
   }


   async findByIdWithRefreshToken(id: string) {
      return await this.userModel.findById(id).select('+refreshToken').exec();
   }


   async update(id: any, dataToUpdate: any): Promise<UserDocument | null> {
      return await this.userModel.findByIdAndUpdate(
         id,
         dataToUpdate
      ).exec();
   }


   async removeToken(id: any) {
      await this.userModel.updateOne(
         { _id: id },
         { $set: { refreshToken: null } }
      ).lean().exec();

      return true;
   }


   async removeAccount(id: string) {
      return await this.userModel.findByIdAndDelete(id);
   }
}