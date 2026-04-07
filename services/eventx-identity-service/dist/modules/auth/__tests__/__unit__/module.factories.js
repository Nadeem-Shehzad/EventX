"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthTestingModule = createAuthTestingModule;
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("../../auth.controller");
const auth_service_1 = require("../../auth.service");
const redis_service_1 = require("../../../../redis/redis.service");
const mailer_1 = require("@nestjs-modules/mailer");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const ref_token_guard_1 = require("../../../../common/guards/ref-token.guard");
const auth_controller_spec_1 = require("./auth.controller.spec");
async function createAuthTestingModule(authServiceMock) {
    const module = await testing_1.Test.createTestingModule({
        controllers: [auth_controller_1.AuthController],
        providers: [
            { provide: auth_service_1.AuthService, useValue: authServiceMock },
            { provide: redis_service_1.RedisService, useValue: {} },
            { provide: mailer_1.MailerService, useValue: {} }
        ]
    })
        .overrideGuard(jwt_auth_guard_1.JwtAuthGuard).useValue(new auth_controller_spec_1.MockGuard())
        .overrideGuard(ref_token_guard_1.JwtRefreshTokenGuard).useValue(new auth_controller_spec_1.MockGuard())
        .compile();
    return {
        controller: module.get(auth_controller_1.AuthController),
        authService: module.get(auth_service_1.AuthService),
    };
}
//# sourceMappingURL=module.factories.js.map