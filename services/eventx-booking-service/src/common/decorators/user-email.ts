import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUserEmail = createParamDecorator((data: unknown, context: ExecutionContext) => {
   const request = context.switchToHttp().getRequest();
   const userEmail = request.user?.email;
   return userEmail;
});