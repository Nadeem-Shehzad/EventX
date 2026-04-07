"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const idempotency_service_1 = require("./idempotency.service");
const idempotency_schema_1 = require("./idempotency.schema");
let IdempotencyModule = class IdempotencyModule {
};
exports.IdempotencyModule = IdempotencyModule;
exports.IdempotencyModule = IdempotencyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: idempotency_schema_1.ProcessedMessage.name,
                    schema: idempotency_schema_1.ProcessedMessageSchema
                }])
        ],
        providers: [idempotency_service_1.IdempotencyService],
        exports: [idempotency_service_1.IdempotencyService],
    })
], IdempotencyModule);
//# sourceMappingURL=idempotency.module.js.map