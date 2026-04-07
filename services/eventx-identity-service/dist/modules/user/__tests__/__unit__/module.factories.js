"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTestingModule = createUserTestingModule;
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("../../user.controller");
const user_service_1 = require("../../user.service");
const user_repository_1 = require("../../user.repository");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const ownership_guard_1 = require("../../../../common/guards/ownership.guard");
const role_guard_1 = require("../../../../common/guards/role.guard");
const user_controller_spec_1 = require("./user.controller.spec");
async function createUserTestingModule(userMockService) {
    const module = await testing_1.Test.createTestingModule({
        controllers: [user_controller_1.UserController],
        providers: [
            { provide: user_service_1.UserService, useValue: userMockService },
            { provide: user_repository_1.UserRepository, useValue: {} },
        ]
    })
        .overrideGuard(jwt_auth_guard_1.JwtAuthGuard).useValue(new user_controller_spec_1.MockGuard())
        .overrideGuard(ownership_guard_1.AccountOwnerShipGuard).useValue(new user_controller_spec_1.MockGuard())
        .overrideGuard(role_guard_1.RoleCheckGuard).useValue(new user_controller_spec_1.MockGuard())
        .compile();
    return {
        controller: module.get(user_controller_1.UserController),
        service: module.get(user_service_1.UserService)
    };
}
//# sourceMappingURL=module.factories.js.map