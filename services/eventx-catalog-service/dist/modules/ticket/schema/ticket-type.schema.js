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
exports.TicketTypeSchema = exports.TicketType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TicketType = class TicketType {
    eventId;
    name;
    totalQuantity;
    availableQuantity;
    reservedQuantity;
    soldQuantity;
    price;
    currency;
    isPaidEvent;
    isActive;
};
exports.TicketType = TicketType;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Event', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TicketType.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], TicketType.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], TicketType.prototype, "totalQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], TicketType.prototype, "availableQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], TicketType.prototype, "reservedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], TicketType.prototype, "soldQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], TicketType.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TicketType.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TicketType.prototype, "isPaidEvent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TicketType.prototype, "isActive", void 0);
exports.TicketType = TicketType = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TicketType);
exports.TicketTypeSchema = mongoose_1.SchemaFactory.createForClass(TicketType);
exports.TicketTypeSchema.index({ eventId: 1, name: 1 }, { unique: true });
exports.TicketTypeSchema.index({ availableQuantity: 1 });
exports.TicketTypeSchema.index({ eventId: 1, availableQuantity: 1 });
//# sourceMappingURL=ticket-type.schema.js.map