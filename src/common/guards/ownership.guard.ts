import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
} from "@nestjs/common";


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


// here we can also add other types of ownership like - ticket ownership
