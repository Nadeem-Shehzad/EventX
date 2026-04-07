"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserEmail = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserEmail = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const userEmail = request.user?.email;
    return userEmail;
});
//# sourceMappingURL=user-email.js.map