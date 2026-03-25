import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BannerImage } from "../../event/dto/event.type";
import { Ticket } from "../../event/dto/ticket.type";


@ObjectType('UserEvent')
export class UserEvent {
   @Field(() => ID)
   id: string

   @Field()
   title: string

   @Field()
   startDateTime: string

   @Field()
   endDateTime: string

   @Field(() => BannerImage)
   bannerImage: BannerImage

   @Field()
   isPaid: boolean

   @Field()
   eventType: string
}