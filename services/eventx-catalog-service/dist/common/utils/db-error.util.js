"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwDbException = throwDbException;
const common_1 = require("@nestjs/common");
function throwDbException(err, context) {
    const ctx = context ? `[${context}] ` : '';
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
        throw new common_1.ConflictException(`${ctx}${field} already exists`);
    }
    if (err.name === 'MongoServerSelectionError' ||
        err.name === 'MongoNetworkError') {
        throw new common_1.ServiceUnavailableException(`${ctx}Database unavailable`);
    }
    if (err.name === 'MongooseError' &&
        err.message?.includes('timed out')) {
        throw new common_1.RequestTimeoutException(`${ctx}Database operation timed out`);
    }
    if (err.name === 'ValidationError') {
        throw new common_1.InternalServerErrorException(`${ctx}Data validation failed`);
    }
    throw new common_1.InternalServerErrorException(`${ctx}Unexpected database error`);
}
//# sourceMappingURL=db-error.util.js.map