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
exports.OutboxRepo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const outbox_schema_1 = require("./outbox.schema");
let OutboxRepo = class OutboxRepo {
    constructor(outboxModel) {
        this.outboxModel = outboxModel;
    }
    async addEvent(aggregateType, aggregateId, eventType, payload, session) {
        const eventPayload = {
            aggregateType,
            aggregateId,
            eventType,
            payload
        };
        const event = await this.outboxModel.create([eventPayload], { session });
        return event;
    }
    async findPending() {
        return await this.outboxModel.find({ status: outbox_schema_1.OutboxStatus.PENDING });
    }
    async markDispatched(eventId) {
        return this.outboxModel.updateOne({ _id: eventId, status: outbox_schema_1.OutboxStatus.PENDING }, { $set: { status: outbox_schema_1.OutboxStatus.DISPATCHED } });
    }
    async markPublished(eventId) {
        return this.outboxModel.updateOne({ _id: eventId, status: outbox_schema_1.OutboxStatus.DISPATCHED }, { $set: { status: outbox_schema_1.OutboxStatus.PUBLISHED } });
    }
    getModel() {
        return this.outboxModel;
    }
};
exports.OutboxRepo = OutboxRepo;
exports.OutboxRepo = OutboxRepo = __decorate([
    __param(0, (0, mongoose_1.InjectModel)('OutboxEvent')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OutboxRepo);
//# sourceMappingURL=outbox.repo.js.map