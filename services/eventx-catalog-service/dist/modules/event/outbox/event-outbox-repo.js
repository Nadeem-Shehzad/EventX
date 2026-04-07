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
exports.EventOutboxRepo = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_outbox_schema_1 = require("./event-outbox-schema");
let EventOutboxRepo = class EventOutboxRepo {
    outboxModel;
    constructor(outboxModel) {
        this.outboxModel = outboxModel;
    }
    async addEvent(aggregateType, aggregateId, eventType, payload, session) {
        return this.outboxModel.create([{
                aggregateType,
                aggregateId,
                eventType,
                payload,
                status: event_outbox_schema_1.EventOutboxStatus.PENDING
            }], { session });
    }
    async markPublished(eventId) {
        return this.outboxModel.updateOne({ _id: eventId }, {
            $set: {
                status: event_outbox_schema_1.EventOutboxStatus.PUBLISHED,
                publishedAt: new Date()
            }
        });
    }
    async markFailed(eventId, error) {
        return this.outboxModel.updateOne({ _id: eventId }, {
            $set: { status: event_outbox_schema_1.EventOutboxStatus.FAILED, lastError: error },
            $inc: { retryCount: 1 }
        });
    }
    getModel() {
        return this.outboxModel;
    }
};
exports.EventOutboxRepo = EventOutboxRepo;
exports.EventOutboxRepo = EventOutboxRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_outbox_schema_1.EventOutbox.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EventOutboxRepo);
//# sourceMappingURL=event-outbox-repo.js.map