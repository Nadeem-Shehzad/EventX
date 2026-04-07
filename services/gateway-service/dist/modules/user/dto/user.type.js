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
exports.User = void 0;
const graphql_1 = require("@nestjs/graphql");
const booking_list_type_1 = require("./booking-list.type");
let UserImage = class UserImage {
    url;
    publicId;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserImage.prototype, "url", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserImage.prototype, "publicId", void 0);
UserImage = __decorate([
    (0, graphql_1.ObjectType)()
], UserImage);
let User = class User {
    id;
    name;
    email;
    role;
    image;
    isVerified;
    userBookings;
};
exports.User = User;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => UserImage),
    __metadata("design:type", UserImage)
], User.prototype, "image", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, graphql_1.Field)(() => booking_list_type_1.UserBookingsList, { nullable: true }),
    __metadata("design:type", booking_list_type_1.UserBookingsList)
], User.prototype, "userBookings", void 0);
exports.User = User = __decorate([
    (0, graphql_1.ObjectType)('User')
], User);
//# sourceMappingURL=user.type.js.map