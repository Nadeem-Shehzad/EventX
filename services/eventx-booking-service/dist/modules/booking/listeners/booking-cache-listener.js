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
exports.BookingCacheListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const redis_service_1 = require("../../../redis/redis.service");
let BookingCacheListener = class BookingCacheListener {
    constructor(redis) {
        this.redis = redis;
    }
    async handleBookingCreated(payload) {
        await this.redis.delPattern(`event-bookings:${payload.eventId}-*`);
        await this.redis.del(`event-bookings:${payload.eventId}`);
        await this.redis.delPattern(`all-bookings:*`);
        await this.redis.del(`all-bookings`);
    }
    async handleBookingUpdated(payload) {
        console.log('inside cache listener -> booking-update');
        await this.redis.delPattern(`event-bookings:${payload.eventId}-*`);
        await this.redis.del(`event-bookings:${payload.eventId}`);
        await this.redis.delPattern(`all-bookings:*`);
        await this.redis.del(`all-bookings`);
    }
};
exports.BookingCacheListener = BookingCacheListener;
__decorate([
    (0, event_emitter_1.OnEvent)('booking.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingCacheListener.prototype, "handleBookingCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingCacheListener.prototype, "handleBookingUpdated", null);
exports.BookingCacheListener = BookingCacheListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], BookingCacheListener);
//# sourceMappingURL=booking-cache-listener.js.map