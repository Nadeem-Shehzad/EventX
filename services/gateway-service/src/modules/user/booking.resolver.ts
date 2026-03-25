import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UserBooking } from './dto/booking.type';
import { UserEvent } from './dto/event.type';
import { EventService } from '../event/event.service';


@Resolver(() => UserBooking)
export class BookingResolver {

   constructor(private eventService: EventService) { }

   @ResolveField(() => UserEvent,{ nullable: true })
   async event(@Parent() booking: UserBooking) {
      return this.eventService.getEvent(booking.eventId);
   }
}