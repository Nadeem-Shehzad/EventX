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
exports.UserBookingsList = exports.BookingMeta = void 0;
const graphql_1 = require("@nestjs/graphql");
const booking_type_1 = require("./booking.type");
let BookingMeta = class BookingMeta {
    total;
    page;
    limit;
    totalPages;
};
exports.BookingMeta = BookingMeta;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BookingMeta.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BookingMeta.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BookingMeta.prototype, "limit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BookingMeta.prototype, "totalPages", void 0);
exports.BookingMeta = BookingMeta = __decorate([
    (0, graphql_1.ObjectType)()
], BookingMeta);
let UserBookingsList = class UserBookingsList {
    bookings;
    meta;
};
exports.UserBookingsList = UserBookingsList;
__decorate([
    (0, graphql_1.Field)(() => [booking_type_1.UserBooking]),
    __metadata("design:type", Array)
], UserBookingsList.prototype, "bookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => BookingMeta),
    __metadata("design:type", BookingMeta)
], UserBookingsList.prototype, "meta", void 0);
exports.UserBookingsList = UserBookingsList = __decorate([
    (0, graphql_1.ObjectType)()
], UserBookingsList);
//# sourceMappingURL=booking-list.type.js.map