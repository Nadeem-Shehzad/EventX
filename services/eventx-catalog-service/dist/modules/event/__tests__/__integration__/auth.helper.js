"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestToken = void 0;
const jwt_1 = require("@nestjs/jwt");
const generateTestToken = (app, payload) => {
    const jwtService = app.get(jwt_1.JwtService);
    return jwtService.sign(payload, {
        secret: 'test-access-secret'
    });
};
exports.generateTestToken = generateTestToken;
//# sourceMappingURL=auth.helper.js.map