import { ObjectType, Field } from "@nestjs/graphql";


@ObjectType('EventTicket')
export class Ticket {

   @Field()
   name: string

   @Field()
   price: number

   @Field()
   available: number

   @Field()
   totalQuantity: number

   @Field()
   availableQuantity: number
}