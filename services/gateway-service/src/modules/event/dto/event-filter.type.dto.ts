import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EventFilterInput {
   @Field({ nullable: true })
   city?: string

   @Field({ nullable: true })
   category?: string

   @Field({ nullable: true })
   tags?: string

   @Field({ nullable: true })
   search?: string

   @Field({ nullable: true })
   page?: number

   @Field({ nullable: true })
   limit?: number
}