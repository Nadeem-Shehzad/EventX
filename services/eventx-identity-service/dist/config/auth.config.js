"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: process.env.JWT_EXPIRES || '1d',
    jwtRTSecret: process.env.JWT_REFRESH_SECRET,
    jwtRTExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    mail_user: process.env.MAIL_USER,
    mail_password: process.env.MAIL_PASSWORD,
    mail_host: process.env.MAIL_HOST,
    mail_port: process.env.MAIL_PORT
});
//# sourceMappingURL=auth.config.js.map