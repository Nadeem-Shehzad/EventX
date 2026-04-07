"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    redis: {
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '15448', 10),
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    }
});
//# sourceMappingURL=redis.config.js.map