import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./dto/user.type";
import { UserBooking } from "./dto/booking.type";


@Resolver(() => User)
export class UserResolver {

   constructor(
      private userService: UserService,
   ) { }


   @Query(() => User, { nullable: true })
   async user(@Args('id') id: string) {
      return this.userService.getUser(id)
   }


   @ResolveField(() => [UserBooking])
   async userBookings(
      @Parent() user: User,
      @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
      @Args('limit', { type: () => Int, nullable: true, defaultValue: 5 }) limit?: number
   ) {
      return this.userService.getBookings(user.id, page, limit)
   }
}