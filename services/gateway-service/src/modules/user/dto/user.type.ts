import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserEvent } from "./event.type";
import { UserBooking } from "./booking.type";
import { UserBookingsList } from "./booking-list.type";


@ObjectType()
class UserImage {
   @Field()
   url: string

   @Field()
   publicId: string
}


@ObjectType('User')
export class User {
   @Field(() => ID)
   id: string

   @Field()
   name: string

   @Field()
   email: string

   @Field()
   role: string

   @Field(() => UserImage)
   image: UserImage

   @Field()
   isVerified: boolean

   @Field(() => UserBookingsList, { nullable: true })
   userBookings?: UserBookingsList
}