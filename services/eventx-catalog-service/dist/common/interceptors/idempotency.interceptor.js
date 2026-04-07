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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const redis_service_1 = require("../../redis/redis.service");
let IdempotencyInterceptor = class IdempotencyInterceptor {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['idempotency-key'];
        const route = request.url.split('/').pop();
        if (!idempotencyKey) {
            console.warn(`⚠️ No idempotency key provided for route: ${route}`);
            return next.handle();
        }
        console.log(`KEY ==> ${idempotencyKey}`);
        const namespacedKey = `${route}:${idempotencyKey}`;
        const cached = await this.redis.get(`idempotency:${namespacedKey}`);
        if (cached) {
            console.log(`--- ✅ Data Returns from REDIS CACHE [${namespacedKey}] ---`);
            const parsed = JSON.parse(cached);
            if (parsed.isError) {
                throw new common_1.HttpException(parsed.error, parsed.statusCode);
            }
            return (0, rxjs_1.of)(parsed.data);
        }
        console.log(`--- ⚡ CACHE MISS [${namespacedKey}] ---`);
        return next.handle().pipe((0, rxjs_1.tap)({
            next: async (responseData) => {
                await this.redis.set(`idempotency:${namespacedKey}`, JSON.stringify({ isError: false, data: responseData }), 60);
            },
            error: async (error) => {
                await this.redis.set(`idempotency:${namespacedKey}`, JSON.stringify({ isError: true, error: error.response, statusCode: error.status }), 60);
            }
        }));
    }
};
exports.IdempotencyInterceptor = IdempotencyInterceptor;
exports.IdempotencyInterceptor = IdempotencyInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], IdempotencyInterceptor);
//# sourceMappingURL=idempotency.interceptor.js.map