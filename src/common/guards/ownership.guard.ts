import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
   NotFoundException,
} from "@nestjs/common";
import { EventService } from "src/modules/event/event.service";


@Injectable()
export class AccountOwnerShipGuard implements CanActivate {

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.id;
      const accountId = request.params?.id;

      if (!userId || !accountId) {
         throw new ForbiddenException('Access denied');
      }

      if (String(userId) !== String(accountId)) {
         throw new ForbiddenException('You can only access your own resource');
      }

      return true;
   }
}


@Injectable()
export class EventOwnerShipGuard implements CanActivate {

   constructor(private readonly eventService: EventService) { }

   async canActivate(context: ExecutionContext): Promise<boolean> {

      const request = context.switchToHttp().getRequest();
      const userId = request.user?.id;
      const eventId = request.params.id;

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