import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type UserDocument = User & Document;


@Schema({ timestamps: true })
export class User {
   @Prop({ required: true, trim: true, min: 3, max: 22 })
   name: string

   @Prop({ required: true, unique: true, lowercase: true, trim: true })
   email: string

   @Prop({ required: true, min: 4, max: 22, select: false })
   password: string

   @Prop({ default: false })
   isVerified: boolean

   @Prop({ enum: ['user', 'admin', 'organizer'], default: 'user' })
   role: string

   @Prop({ type: [String], default: [] })
   permissions: string[]

   @Prop({ default: null, select: false })
   refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User);