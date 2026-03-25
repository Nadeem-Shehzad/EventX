import { Resolver, Query, Args, ResolveField, Parent, Int } from "@nestjs/graphql";
import { Event } from "./dto/event.type";
import { EventService } from "./event.service";
import { Ticket } from "./dto/ticket.type";
import { Organizer } from "./dto/organizer.type";
import { EventsList } from "./dto/event-list.type";
import { EventFilterInput } from "./dto/event-filter.type.dto";


@Resolver(() => Event)
export class EventResolver {

   constructor(private eventService: EventService) { } 

   // Main-Query
   @Query(() => Event, { nullable: true })
   async event(@Args('id') id: string) {
      return this.eventService.getEvent(id);
   }

   @ResolveField(() => [Ticket])
   async tickets(@Parent() event: Event) {
      return this.eventService.getTickets(event.id);
   }

   @ResolveField(() => Organizer)
   async organizer(@Parent() event: Event) {
      return this.eventService.getOrganizer(event.organizerId);
   }


   @Query(() => EventsList)
   async events(
      @Args('filter', { nullable: true }) filter?: EventFilterInput,
      @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
      @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
   ) {
      return this.eventService.getEvents(filter ?? {}, page, limit);
   }
}