import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event } from './event.type';

@ObjectType()
export class EventsList {
   @Field(() => [Event])
   data: Event[]

   @Field(() => Int)
   total: number

   @Field(() => Int)
   page: number

   @Field(() => Int)
   limit: number
}