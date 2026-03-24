import { Resolver, Query, Args, ResolveField, Parent } from "@nestjs/graphql";
import { Event } from "./dto/event.type";
import { EventService } from "./event.service";
import { Ticket } from "./dto/ticket.type";
import { Organizer } from "./dto/organizer.type";

@Resolver(() => Event)
export class EventResolver {
   constructor(private eventService: EventService) { }

   // @Query(() => String)
   // async ping(): Promise<string> {
   //    console.log('PING HIT')
   //    return 'pong';
   // }

   // Main-Query
   @Query(() => Event, { nullable: true })
   async event(@Args('id') id: string) {
      return this.eventService.getEvent(id);
   }

   // FIELD RESOLVERS
   @ResolveField(() => [Ticket])
   async tickets(@Parent() event: Event) {
      //console.log('Parent event:', event);
      return this.eventService.getTickets(event.id);
   }

   @ResolveField(() => Organizer)
   async organizer(@Parent() event: Event) {
      //return this.eventService.getOrganizer(event.organizerId);
   }
}