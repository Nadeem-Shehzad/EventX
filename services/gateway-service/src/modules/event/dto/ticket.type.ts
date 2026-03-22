import { ObjectType, Field } from "@nestjs/graphql";


@ObjectType()
export class Ticket {
   @Field()
   price: number

   @Field()
   available: number
}