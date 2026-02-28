import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUserID = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userID = request.user?.id;
    return userID;
});