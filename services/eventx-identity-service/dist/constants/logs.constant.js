"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METHOD = exports.ACTION = exports.STATUS = void 0;
exports.STATUS = {
    START: 'start',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed'
};
exports.ACTION = {
    REGISTER: 'register',
    LOGIN: 'login',
    LOGOUT: 'logout',
    CHANGE_PASSOWRD: 'change_password',
    FORGOT_PASSWORD: 'forgot_password'
};
exports.METHOD = {
    POST: 'post',
    GET: 'get',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete',
};
//# sourceMappingURL=logs.constant.js.map