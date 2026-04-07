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
exports.UserEvent = void 0;
const graphql_1 = require("@nestjs/graphql");
const event_type_1 = require("../../event/dto/event.type");
let UserEvent = class UserEvent {
    id;
    title;
    startDateTime;
    endDateTime;
    bannerImage;
    isPaid;
    eventType;
};
exports.UserEvent = UserEvent;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UserEvent.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserEvent.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserEvent.prototype, "startDateTime", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserEvent.prototype, "endDateTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => event_type_1.BannerImage),
    __metadata("design:type", event_type_1.BannerImage)
], UserEvent.prototype, "bannerImage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UserEvent.prototype, "isPaid", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserEvent.prototype, "eventType", void 0);
exports.UserEvent = UserEvent = __decorate([
    (0, graphql_1.ObjectType)('UserEvent')
], UserEvent);
//# sourceMappingURL=event.type.js.map