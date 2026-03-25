import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserEvent } from "./event.type";


@ObjectType('UserBooking')
export class UserBooking {
    @Field(() => ID)
    id: string

    @Field()
    amount: number

    @Field()
    quantity: number

    @Field()
    status: string

    @Field()
    eventId: string

    @Field(() => UserEvent, { nullable: true })
    event?: UserEvent
}