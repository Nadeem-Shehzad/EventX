import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TicketType } from "./ticket-type.schema";

export type EventDocument = Event & Document;


@Schema({ timestamps: true })
export class Event {
   @Prop({ type: Types.ObjectId, required: true, index: true })
   organizerId: Types.ObjectId

   @Prop({ required: true, unique: true, index: true })
   slug: string

   @Prop({ required: true, trim: true, min: 3 })
   title: string

   @Prop({ required: true, trim: true, min: 15 })
   description: string

   @Prop({ required: true, index: true })
   category: string

   @Prop({ type: [String], default: [] })
   tags: string[]

   @Prop({
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline',
      required: true,
      index: true
   })
   eventType: string


   @Prop({
      type: {
         url: String,
         publicId: String
      },
      required: true,
      _id: false
   })
   bannerImage: { url: string; publicId: string }


   @Prop({ required: true, index: true })
   startDateTime: Date

   @Prop({ required: true })
   endDateTime: Date

   @Prop({ required: true })
   timezone: string


   @Prop({
      type: {
         venueName: { type: String },
         address: { type: String },
         city: { type: String, index: true },
         country: { type: String },
         latitude: { type: Number },
         longitude: { type: Number },
      },
      _id: false,
   })
   location?: {
      venueName: string;
      address: string;
      city: string;
      country: string;
      latitude?: number;
      longitude?: number;
   };


   @Prop({
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft',
      index: true
   })
   status: string

   @Prop({
      enum: ['public', 'private'],
      default: 'private',
      index: true
   })
   visibility: string

   @Prop({ default: false, index: true })
   isDeleted: boolean

   @Prop()
   deletedAt: Date

   @Prop()
   archivedAt: Date


   @Prop({ required: true, min: 1 })
   capacity: number

   @Prop({ default: 0, min: 0 })
   registeredCount: number

   @Prop()
   registrationDeadline?: Date

   @Prop({ default: false, index: true })
   isPaid: boolean
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ organizerId: 1, isDeleted: 1 });
EventSchema.index({ category: 1, status: 1 });
EventSchema.index({ status: 1, startDateTime: 1 });
EventSchema.index({ status: 1, isDeleted: 1, isPaid: 1, startDateTime: 1});
EventSchema.index({ status: 1, isDeleted: 1, startDateTime: 1});
EventSchema.index({ visibility: 1, isDeleted: 1, startDateTime: 1});