"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    PORT: parseInt(process.env.PORT ?? '3001', 10),
    NODE_ENV: process.env.NODE_ENV,
    RABBITMQ_URI: process.env.RABBITMQ_URI
});
//# sourceMappingURL=config.app.js.map