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
var IdempotencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const idempotency_schema_1 = require("./idempotency.schema");
let IdempotencyService = IdempotencyService_1 = class IdempotencyService {
    processedMessageModel;
    logger = new common_1.Logger(IdempotencyService_1.name);
    constructor(processedMessageModel) {
        this.processedMessageModel = processedMessageModel;
    }
    async tryMarkAsProcessing(messageId, metadata) {
        try {
            const result = await this.processedMessageModel.collection.findOneAndUpdate({ messageId }, {
                $setOnInsert: {
                    messageId,
                    bookingId: metadata.bookingId,
                    email: metadata.email,
                    processedAt: new Date(),
                }
            }, {
                upsert: true,
                returnDocument: 'before',
            });
            return result === null;
        }
        catch (error) {
            this.logger.error(`Idempotency check failed: ${error.message}`);
            throw error;
        }
    }
    async deleteRecord(messageId) {
        await this.processedMessageModel.deleteOne({ messageId });
    }
};
exports.IdempotencyService = IdempotencyService;
exports.IdempotencyService = IdempotencyService = IdempotencyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(idempotency_schema_1.ProcessedMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IdempotencyService);
//# sourceMappingURL=idempotency.service.js.map