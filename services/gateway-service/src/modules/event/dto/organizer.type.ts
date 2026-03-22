import { ObjectType, Field, ID } from "@nestjs/graphql";


@ObjectType()
export class Organizer {
   @Field(() => ID)
   id: string

   @Field()
   name: string
}