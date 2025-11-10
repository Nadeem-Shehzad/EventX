import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";


@Injectable()
export class UserService {

   constructor(@InjectModel('User') private userModel: Model<UserDocument>) { }

   async findByEmail(email: string): Promise<UserDocument | null> {
      return await this.userModel.findOne({ email }).exec();
   }

   async create(data: Partial<User>): Promise<UserDocument | null> {
      return await this.userModel.create(data);
   }
}