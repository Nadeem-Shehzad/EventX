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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const http_service_1 = require("../../common/http/http.service");
let UserService = class UserService {
    http;
    constructor(http) {
        this.http = http;
    }
    async getUser(id) {
        if (!id)
            return null;
        const user = await this.http.get(`${process.env.IDENTITY_SERVICE_URL}/users/internal/${id}`);
        return {
            ...user,
            id
        };
    }
    async getBookings(id, page = 1, limit = 5) {
        if (!id)
            return [];
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('page', String(page));
        params.append('limit', String(limit));
        const response = await this.http.get(`${process.env.BOOKING_SERVICE_URL}/bookings/internal/user-bookings?${params.toString()}`);
        const { bookings, meta } = response.data;
        return {
            bookings: bookings.map(booking => ({
                ...booking,
                id: booking._id?.toString() || booking.id,
            })),
            meta,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], UserService);
//# sourceMappingURL=user.service.js.map