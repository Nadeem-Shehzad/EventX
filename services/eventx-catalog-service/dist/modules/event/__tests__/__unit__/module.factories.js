"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventTestingModule = createEventTestingModule;
const testing_1 = require("@nestjs/testing");
const redis_service_1 = require("../../../../redis/redis.service");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const event_controller_1 = require("../../event.controller");
const event_service_1 = require("../../event.service");
const role_guard_1 = require("../../../../common/guards/role.guard");
const ownership_guard_1 = require("../../guards/ownership.guard");
class MockGuard {
    canActivate() {
        return true;
    }
}
async function createEventTestingModule(eventServiceMock) {
    const module = await testing_1.Test.createTestingModule({
        controllers: [event_controller_1.EventController],
        providers: [
            { provide: event_service_1.EventService, useValue: eventServiceMock },
            { provide: redis_service_1.RedisService, useValue: {} }
        ]
    })
        .overrideGuard(jwt_auth_guard_1.JwtAuthGuard).useValue(new MockGuard())
        .overrideGuard(role_guard_1.RoleCheckGuard).useValue(new MockGuard())
        .overrideGuard(ownership_guard_1.EventOwnerShipGuard).useValue(new MockGuard())
        .compile();
    return {
        controller: module.get(event_controller_1.EventController),
        service: module.get(event_service_1.EventService),
    };
}
//# sourceMappingURL=module.factories.js.map