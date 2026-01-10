import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
   NotFoundException
} from "@nestjs/common";

import { EventService } from "../event.service";


@Injectable()
export class EventOwnerShipGuard implements CanActivate {

   constructor(private readonly eventService: EventService) { }

   async canActivate(context: ExecutionContext): Promise<boolean> {

      const request = context.switchToHttp().getRequest();
      const userId = request.user?.id || request.user?._id;;
      const eventId = request.params.id;

      // console.log('************ For Testing **************');
      // console.log('userID', userId);

      if (!userId || !eventId) {
         throw new ForbiddenException('Invalid request');
      }

      const event = await this.eventService.findEventOwner(eventId);
      if (!event) {
         throw new NotFoundException('Event Not Found!');
      }

      if (String(event.organizerId) !== String(userId)) {
         throw new ForbiddenException('Access Denied! u r not owner of this event.')
      }

      return true;
   }
}