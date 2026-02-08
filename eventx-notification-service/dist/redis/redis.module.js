"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRedisModule = void 0;
const ioredis_1 = require("@nestjs-modules/ioredis");
const common_1 = require("@nestjs/common");
const redis_1 = require("../constants/redis");
const config_1 = require("@nestjs/config");
let NotificationRedisModule = class NotificationRedisModule {
};
exports.NotificationRedisModule = NotificationRedisModule;
exports.NotificationRedisModule = NotificationRedisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ioredis_1.RedisModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'single',
                    url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
                    options: {
                        maxRetriesPerRequest: 3,
                        connectTimeout: 10000,
                        commandTimeout: redis_1.REDIS_TIMEOUTS.defaultCommandTimeout,
                        enableReadyCheck: true,
                    }
                })
            })
        ]
    })
], NotificationRedisModule);
//# sourceMappingURL=redis.module.js.map