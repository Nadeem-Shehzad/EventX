import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/user-roles";


@Injectable()
export class RoleCheckGuard implements CanActivate {

   constructor(private reflector: Reflector) { }

   async canActivate(context: ExecutionContext): Promise<boolean> {

      const allowedRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
         context.getHandler(),
         context.getClass()
      ]);

      if (!allowedRoles || allowedRoles.length === 0) {
         return true;
      }

      const request = context.switchToHttp().getRequest();
      const userRole = request.user?.role;

      if (!allowedRoles.includes(userRole)) {
         throw new ForbiddenException('Role Access Denied!');
      }

      return true;
   }
}