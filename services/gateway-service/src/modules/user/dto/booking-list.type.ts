import { Field, Int, ObjectType } from "@nestjs/graphql"
import { UserBooking } from "./booking.type"

@ObjectType()
export class BookingMeta {
   @Field(() => Int)
   total: number

   @Field(() => Int)
   page: number

   @Field(() => Int)
   limit: number

   @Field(() => Int)
   totalPages: number
}

@ObjectType()
export class UserBookingsList {
   @Field(() => [UserBooking])
   bookings: UserBooking[]

   @Field(() => BookingMeta)
   meta: BookingMeta
}