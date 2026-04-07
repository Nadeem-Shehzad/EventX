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
exports.NotificationOutboxSchema = exports.NotificationOutbox = exports.NotificationOutboxStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var NotificationOutboxStatus;
(function (NotificationOutboxStatus) {
    NotificationOutboxStatus["PENDING"] = "PENDING";
    NotificationOutboxStatus["PUBLISHED"] = "PUBLISHED";
    NotificationOutboxStatus["FAILED"] = "FAILED";
})(NotificationOutboxStatus || (exports.NotificationOutboxStatus = NotificationOutboxStatus = {}));
let NotificationOutbox = class NotificationOutbox extends mongoose_2.Document {
};
exports.NotificationOutbox = NotificationOutbox;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationOutbox.prototype, "aggregateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationOutbox.prototype, "aggregateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationOutbox.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], NotificationOutbox.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: NotificationOutboxStatus, default: NotificationOutboxStatus.PENDING }),
    __metadata("design:type", String)
], NotificationOutbox.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NotificationOutbox.prototype, "retryCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NotificationOutbox.prototype, "lastError", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], NotificationOutbox.prototype, "publishedAt", void 0);
exports.NotificationOutbox = NotificationOutbox = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NotificationOutbox);
exports.NotificationOutboxSchema = mongoose_1.SchemaFactory.createForClass(NotificationOutbox);
//# sourceMappingURL=notification-outbox.schema.js.map