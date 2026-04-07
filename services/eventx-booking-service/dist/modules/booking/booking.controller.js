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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const user_roles_1 = require("../../common/decorators/user-roles");
const used_id_1 = require("../../common/decorators/used-id");
const booking_query_dto_1 = require("./dto/booking-query.dto");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const create_booking_response_dto_1 = require("./swagger/response/create-booking-response.dto");
const booking_response_dto_1 = require("./dto/booking.response.dto");
const all_bookings_response_dto_1 = require("./swagger/response/all-bookings-response.dto");
const idempotency_interceptor_1 = require("../../common/interceptors/idempotency.interceptor");
let BookingController = class BookingController {
    constructor(service) {
        this.service = service;
    }
    createBooking(userId, dto) {
        console.log('Inside CreateBooking - Contorller');
        return this.service.createBooking(userId, dto);
    }
    getAllBookings(page = 1, limit = 10) {
        return this.service.getAllBookings(page, limit);
    }
    getBookingsByFilter(query) {
        return this.service.bookingByFilter(query);
    }
    getOneBooking(id) {
        return this.service.getOneBooking(id);
    }
    getEventBookings(eventId, page = 1, limit = 10) {
        return this.service.getEventBookings(eventId, page, limit);
    }
    getUserBookings(userId, page = 1, limit = 10) {
        return this.service.getUserBookings(userId, page, limit);
    }
    async getUserBookings_Internal(id, page, limit, apiKey) {
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            throw new common_1.UnauthorizedException('Invalid internal API key');
        }
        const data = await this.service.getUserBookings(id, page, limit);
        return data;
    }
    async getBookingInternal(id, apiKey) {
        console.log('############# INSIDE BOOKING CONTROLLER #############');
        console.log(`BookingID --> ${id}`);
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            throw new common_1.UnauthorizedException('Invalid internal API key');
        }
        const data = await this.service.getOneBooking(id);
        console.log(`Booking Amount -> ${data.amount}`);
        console.log(`Booking Quantity -> ${data.quantity}`);
        return data;
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('user'),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create booking' }),
    (0, swagger_1.ApiBody)({
        type: create_booking_dto_1.CreateBookingDTO
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: create_booking_response_dto_1.CreateBookingResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not Found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_booking_dto_1.CreateBookingDTO]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all booking' }),
    (0, swagger_1.ApiQuery)({
        name: 'page', required: true,
        schema: {
            type: 'number',
            example: 1
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit', required: true,
        schema: {
            type: 'number',
            example: 10
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: all_bookings_response_dto_1.PaginatedBookingsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('filter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings by filter' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: all_bookings_response_dto_1.PaginatedBookingsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_query_dto_1.BookingQueryDTO]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBookingsByFilter", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings by id' }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        required: true,
        schema: {
            type: 'string',
            example: 'skjhfsjdhsjkdfh87s'
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: booking_response_dto_1.BookingResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getOneBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('event/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get event bookings' }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        required: true,
        schema: {
            type: 'string',
            example: 'skjhfsjdhsjkdfh87s'
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: true,
        schema: {
            type: 'number',
            example: 1
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: true,
        schema: {
            type: 'number',
            example: 10
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: all_bookings_response_dto_1.PaginatedBookingsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getEventBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('user/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bookings' }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        required: true,
        schema: {
            type: 'string',
            example: 'skjhfsjdhsjkdfh87s'
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: true,
        schema: {
            type: 'number',
            example: 1
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: true,
        schema: {
            type: 'number',
            example: 10
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: all_bookings_response_dto_1.PaginatedBookingsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getUserBookings", null);
__decorate([
    (0, common_1.Get)('internal/user-bookings'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Headers)('x-internal-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getUserBookings_Internal", null);
__decorate([
    (0, common_1.Get)('internal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-internal-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingInternal", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)({ path: 'bookings', version: '1' }),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map