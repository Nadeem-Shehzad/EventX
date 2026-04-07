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
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Event = class Event {
    organizerId;
    slug;
    title;
    description;
    category;
    tags;
    eventType;
    bannerImage;
    startDateTime;
    endDateTime;
    timezone;
    location;
    status;
    visibility;
    isDeleted;
    deletedAt;
    archivedAt;
    capacity;
    registeredCount;
    registrationDeadline;
    isPaid;
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Event.prototype, "organizerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Event.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, min: 3 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, min: 15 }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Event.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['online', 'offline', 'hybrid'],
        default: 'offline',
        required: true,
        index: true
    }),
    __metadata("design:type", String)
], Event.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            url: String,
            publicId: String
        },
        required: true,
        _id: false
    }),
    __metadata("design:type", Object)
], Event.prototype, "bannerImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], Event.prototype, "startDateTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Event.prototype, "endDateTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            venueName: { type: String },
            address: { type: String },
            city: { type: String, index: true },
            country: { type: String },
            latitude: { type: Number },
            longitude: { type: Number },
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], Event.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft',
        index: true
    }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['public', 'private'],
        default: 'private',
        index: true
    }),
    __metadata("design:type", String)
], Event.prototype, "visibility", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Event.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Event.prototype, "archivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Event.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "registeredCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Event.prototype, "registrationDeadline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "isPaid", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
exports.EventSchema.index({ organizerId: 1, isDeleted: 1 });
exports.EventSchema.index({ category: 1, status: 1 });
exports.EventSchema.index({ status: 1, startDateTime: 1 });
exports.EventSchema.index({ status: 1, isDeleted: 1, isPaid: 1, startDateTime: 1 });
exports.EventSchema.index({ status: 1, isDeleted: 1, startDateTime: 1 });
exports.EventSchema.index({ visibility: 1, isDeleted: 1, startDateTime: 1 });
//# sourceMappingURL=event.schema.js.map