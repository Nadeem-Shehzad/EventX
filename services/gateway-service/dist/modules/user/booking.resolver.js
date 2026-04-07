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
exports.BookingResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const booking_type_1 = require("./dto/booking.type");
const event_type_1 = require("./dto/event.type");
const event_service_1 = require("../event/event.service");
let BookingResolver = class BookingResolver {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async event(booking) {
        return this.eventService.getEvent(booking.eventId);
    }
};
exports.BookingResolver = BookingResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => event_type_1.UserEvent, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_type_1.UserBooking]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "event", null);
exports.BookingResolver = BookingResolver = __decorate([
    (0, graphql_1.Resolver)(() => booking_type_1.UserBooking),
    __metadata("design:paramtypes", [event_service_1.EventService])
], BookingResolver);
//# sourceMappingURL=booking.resolver.js.map