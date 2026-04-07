"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '15448', 10),
    }
});
//# sourceMappingURL=redis.config.js.map