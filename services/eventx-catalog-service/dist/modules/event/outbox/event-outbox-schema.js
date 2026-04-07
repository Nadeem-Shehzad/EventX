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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventOutboxSchema = exports.EventOutbox = exports.EventOutboxStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var EventOutboxStatus;
(function (EventOutboxStatus) {
    EventOutboxStatus["PENDING"] = "PENDING";
    EventOutboxStatus["PUBLISHED"] = "PUBLISHED";
    EventOutboxStatus["FAILED"] = "FAILED";
})(EventOutboxStatus || (exports.EventOutboxStatus = EventOutboxStatus = {}));
let EventOutbox = class EventOutbox extends mongoose_2.Document {
    aggregateType;
    aggregateId;
    eventType;
    payload;
    status;
    retryCount;
    lastError;
    publishedAt;
};
exports.EventOutbox = EventOutbox;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventOutbox.prototype, "aggregateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventOutbox.prototype, "aggregateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventOutbox.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], EventOutbox.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: EventOutboxStatus, default: EventOutboxStatus.PENDING }),
    __metadata("design:type", String)
], EventOutbox.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EventOutbox.prototype, "retryCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EventOutbox.prototype, "lastError", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EventOutbox.prototype, "publishedAt", void 0);
exports.EventOutbox = EventOutbox = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EventOutbox);
exports.EventOutboxSchema = mongoose_1.SchemaFactory.createForClass(EventOutbox);
//# sourceMappingURL=event-outbox-schema.js.map