"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserID = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserID = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const userID = request.user?.id;
    return userID;
});
//# sourceMappingURL=used-id.js.map