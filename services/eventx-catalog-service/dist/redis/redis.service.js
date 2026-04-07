"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const ioredis_1 = require("@nestjs-modules/ioredis");
const common_1 = require("@nestjs/common");
const ioredis_2 = require("ioredis");
let RedisService = class RedisService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async set(key, value, ttl) {
        if (ttl)
            return this.redis.set(key, value, 'EX', ttl);
        return this.redis.set(key, value);
    }
    async get(key) {
        return this.redis.get(key);
    }
    async del(key) {
        return this.redis.del(key);
    }
    async decrby(key, value) {
        return this.redis.decrby(key, value);
    }
    async incrby(key, value) {
        return this.redis.incrby(key, value);
    }
    pipeline() {
        return this.redis.pipeline();
    }
    async delPattern(pattern) {
        const allKeys = await this.redis.keys(pattern);
        if (allKeys.length > 0) {
            await this.redis.del(allKeys);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.Redis])
], RedisService);
//# sourceMappingURL=redis.service.js.map