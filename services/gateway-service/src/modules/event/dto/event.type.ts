import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Ticket } from "./ticket.type";
import { Organizer } from "./organizer.type";


@ObjectType()
export class BannerImage {
   @Field()
   url: string

   @Field()
   publicId: string
}


@ObjectType('Event')
export class Event {
   @Field(() => ID)
   id: string

   @Field()
   title: string

   @Field()
   capacity: number

   @Field()
   startDateTime: string

   @Field()
   endDateTime: string

   @Field()
   registrationDeadline: string

   @Field(() => BannerImage)
   bannerImage: BannerImage

   @Field()
   isPaid: boolean

   @Field()
   eventType: string

   @Field(() => [Ticket], { nullable: true })
   ticket?: Ticket[]

   @Field(() => Organizer, { nullable: true })
   organizer?: Organizer

   // internal field
   organizerId: string
}
