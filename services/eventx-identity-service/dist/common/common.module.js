"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const ref_token_guard_1 = require("./guards/ref-token.guard");
const ownership_guard_1 = require("./guards/ownership.guard");
const role_guard_1 = require("./guards/role.guard");
const redis_module_1 = require("../redis/redis.module");
const idempotency_interceptor_1 = require("./interceptors/idempotency.interceptor");
const logger_module_1 = require("./logger/logger.module");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            logger_module_1.LoggerModule,
            jwt_1.JwtModule.register({}),
            redis_module_1.MyRedisModule
        ],
        providers: [
            jwt_auth_guard_1.JwtAuthGuard,
            ref_token_guard_1.JwtRefreshTokenGuard,
            ownership_guard_1.AccountOwnerShipGuard,
            role_guard_1.RoleCheckGuard,
            idempotency_interceptor_1.IdempotencyInterceptor,
        ],
        exports: [
            jwt_auth_guard_1.JwtAuthGuard,
            ref_token_guard_1.JwtRefreshTokenGuard,
            jwt_1.JwtModule,
            ownership_guard_1.AccountOwnerShipGuard,
            role_guard_1.RoleCheckGuard,
            logger_module_1.LoggerModule,
        ]
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map