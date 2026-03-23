import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { BaseRepository } from "src/common/base/base.pipeline";
import { throwDbException } from "src/common/utils/db-error.util";


@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {

   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>
   ) { super(userModel) }


   async create(data: Partial<User>): Promise<UserDocument> {
      try {
         return await this.safeQuery(
            () => this.userModel.create(data) as unknown as Promise<UserDocument>,
            { retry: false, context: 'UserRepository.create' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.create');
      }
   }

   async update(id: string, data: Partial<User>): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel
               .findOneAndUpdate({ _id: id }, data, { new: true })
               .exec(),
            { retry: false, context: 'UserRepository.update' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.update');
      }
   }

   async removeAccount(id: string): Promise<boolean> {
      try {
         const result = await this.safeQuery(
            () => this.userModel.deleteOne({ _id: id }).exec(),
            { retry: false, context: 'UserRepository.removeAccount' }
         );
         return result.deletedCount > 0;
      } catch (err) {
         throwDbException(err, 'UserRepository.removeAccount');
      }
   }

   async removeToken(id: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel
               .findOneAndUpdate({ _id: id }, { refreshToken: null }, { new: true })
               .exec(),
            { retry: false, context: 'UserRepository.removeToken' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.removeToken');
      }
   }


   async findUserById(id: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel.findById(id).exec(),
            { context: 'UserRepository.findUserById' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findUserById');
      }
   }


   async findByEmail(email: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel.findOne({ email }).exec(),
            { context: 'UserRepository.findByEmail' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findByEmail');
      }
   }


   async findAllUsers(): Promise<UserDocument[]> {
      try {
         return await this.safeQuery(
            () => this.userModel.find().exec(),
            {
               fallback: [],   // graceful degradation — [] instead of 503
               context: 'UserRepository.findAllUsers'
            }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findAllUsers');
      }
   }


   async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel.findOne({ email }).select('+password').exec(),
            { context: 'UserRepository.findByEmailWithPassword' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findByEmailWithPassword');
      }
   }


   async findByIDWithPassword(id: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel.findById(id).select('+password').exec(),
            { context: 'UserRepository.findByIDWithPassword' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findByIDWithPassword');
      }
   }


   async findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
      try {
         return await this.safeQuery(
            () => this.userModel.findById(id).select('+refreshToken').exec(),
            { context: 'UserRepository.findByIdWithRefreshToken' }
         );
      } catch (err) {
         throwDbException(err, 'UserRepository.findByIdWithRefreshToken');
      }
   }
}