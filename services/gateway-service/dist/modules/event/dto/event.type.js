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
exports.Event = exports.BannerImage = void 0;
const graphql_1 = require("@nestjs/graphql");
const ticket_type_1 = require("./ticket.type");
const organizer_type_1 = require("./organizer.type");
let BannerImage = class BannerImage {
    url;
    publicId;
};
exports.BannerImage = BannerImage;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BannerImage.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BannerImage.prototype, "publicId", void 0);
exports.BannerImage = BannerImage = __decorate([
    (0, graphql_1.ObjectType)()
], BannerImage);
let Event = class Event {
    id;
    title;
    capacity;
    startDateTime;
    endDateTime;
    registrationDeadline;
    bannerImage;
    isPaid;
    eventType;
    ticket;
    organizer;
    organizerId;
};
exports.Event = Event;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Event.prototype, "capacity", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Event.prototype, "startDateTime", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Event.prototype, "endDateTime", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Event.prototype, "registrationDeadline", void 0);
__decorate([
    (0, graphql_1.Field)(() => BannerImage),
    __metadata("design:type", BannerImage)
], Event.prototype, "bannerImage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Event.prototype, "isPaid", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Event.prototype, "eventType", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ticket_type_1.Ticket], { nullable: true }),
    __metadata("design:type", Array)
], Event.prototype, "ticket", void 0);
__decorate([
    (0, graphql_1.Field)(() => organizer_type_1.Organizer, { nullable: true }),
    __metadata("design:type", organizer_type_1.Organizer)
], Event.prototype, "organizer", void 0);
exports.Event = Event = __decorate([
    (0, graphql_1.ObjectType)('Event')
], Event);
//# sourceMappingURL=event.type.js.map