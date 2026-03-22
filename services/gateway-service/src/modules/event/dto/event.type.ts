import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Ticket } from "./ticket.type";
import { Organizer } from "./organizer.type";


@ObjectType()
export class Event {
   @Field(() => ID)
   id: string

   @Field()
   title: string

   @Field()
   date: string

   @Field(() => [Ticket], { nullable: true })
   ticket?: Ticket[]

   @Field(() => Organizer, { nullable: true })
   organizer?: Organizer

   // internal field
   organizerId?: string
}