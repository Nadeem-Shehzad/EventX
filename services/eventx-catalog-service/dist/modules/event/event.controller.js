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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const event_service_1 = require("./event.service");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const used_id_1 = require("../../common/decorators/used-id");
const role_guard_1 = require("../../common/guards/role.guard");
const user_roles_1 = require("../../common/decorators/user-roles");
const create_event_dto_1 = require("./dto/request/create-event.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_storage_1 = require("../../common/uploads/cloudinary.storage");
const event_query_dto_1 = require("./dto/request/event-query.dto");
const event_status_dto_1 = require("./dto/request/event-status.dto");
const event_visibility_dto_1 = require("./dto/request/event-visibility.dto");
const pagination_dto_1 = require("./dto/request/pagination.dto");
const update_event_dto_1 = require("./dto/request/update-event.dto");
const ownership_guard_1 = require("./guards/ownership.guard");
const swagger_1 = require("@nestjs/swagger");
const create_event_response_dto_1 = require("./dto/response/create-event-response.dto");
const paginated_events_response_dto_1 = require("./dto/response/paginated-events-response.dto");
const event_response_dto_1 = require("./dto/response/event-response.dto");
const status_summary_response_dto_1 = require("./swagger/response/status-summary-response.dto");
const visibility_summary_response_dto_1 = require("./swagger/response/visibility-summary-response.dto");
const event_type_summary_response_dto_1 = require("./swagger/response/event-type-summary-response.dto");
const tags_summary_response_dto_1 = require("./swagger/response/tags-summary-response.dto");
const idempotency_interceptor_1 = require("../../common/interceptors/idempotency.interceptor");
let EventController = class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    logger = new common_1.Logger(event_service_1.EventService.name);
    addEvent(organizerId, data) {
        return this.eventService.createEvent(organizerId, data);
    }
    UploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('Image is required');
        const imageData = {
            url: file.path,
            publicId: file.filename
        };
        return imageData;
    }
    updateEvent(eventId, dataToUpdate) {
        return this.eventService.updateEvent(eventId, dataToUpdate);
    }
    getEvents(pagination) {
        const { page, limit } = pagination;
        return this.eventService.getAllEventsByAggregate(page, limit);
    }
    getEventsByFilter(query) {
        return this.eventService.getEventsByFilter(query);
    }
    getFreeEvents(pagination) {
        const { page, limit } = pagination;
        return this.eventService.getFreeEvents(page, limit);
    }
    getPaidEvents(pagination) {
        const { page, limit } = pagination;
        return this.eventService.getPaidEvents(page, limit);
    }
    getOrganizerEvents(id, page, limit) {
        return this.eventService.getOrganizerEvents(id, page, limit);
    }
    getOrganizerOwnEvents(id, page, limit) {
        return this.eventService.getOrganizerOwnEvents(id, page, limit);
    }
    getEventsByStatus(query, page, limit) {
        return this.eventService.filterEventsByStatus(query.status, page, limit);
    }
    filterEventsByVisibility(query, page, limit) {
        return this.eventService.filterEventsByVisibility(query.visibility, page, limit);
    }
    eventsStatusSummary() {
        return this.eventService.eventStatusSummary();
    }
    eventsVisibilitySummary() {
        return this.eventService.eventVisibilitySummary();
    }
    eventsTypeSummary() {
        return this.eventService.eventTypeSummary();
    }
    eventTagsSummary() {
        return this.eventService.eventTagsSummary();
    }
    upcomingEvents(page, limit) {
        return this.eventService.getUpcomingEvents(page, limit);
    }
    publishEvent(eventId, organizerId) {
        return this.eventService.publishEvent(eventId, organizerId);
    }
    cancelEvent(eventId, organizerId) {
        return this.eventService.cancelEvent(eventId, organizerId);
    }
    softDeleteEvent(eventId, organizerId) {
        return this.eventService.softDeleteEvent(eventId, organizerId);
    }
    recoverDeletedEvent(eventId, organizerId) {
        return this.eventService.recoverDeletedEvent(eventId, organizerId);
    }
    deleteEventPermanently(id, organizerId) {
        return this.eventService.deleteEventPermanently(id, organizerId);
    }
    async getEventsByFilter_Internal(query, apiKey) {
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            throw new common_1.UnauthorizedException('Invalid internal API key');
        }
        return this.eventService.getEventsByFilter(query);
    }
    async getEvent_Internal(id, apiKey) {
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            throw new common_1.UnauthorizedException('Invalid internal API key');
        }
        return this.eventService.findById(id);
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Post)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new event' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Event created successfully',
        type: create_event_response_dto_1.CreateEventResponseDTO,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_event_dto_1.CreateEventDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "addEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('/image-upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, cloudinary_storage_1.getCloudinaryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "UploadImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an event' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Event updated successfully',
        type: update_event_dto_1.UpdateEventDTO,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_dto_1.UpdateEventDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', example: 1, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', example: 10, required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getEvents", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('/filter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated) based on filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_query_dto_1.EventQueryDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getEventsByFilter", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('/free'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all free events (paginated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of free events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getFreeEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('/paid'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all paid events (paginated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of paid events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getPaidEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('admin', 'organizer'),
    (0, common_1.Get)('/organizer/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated) based on organizerId' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of organizer events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getOrganizerEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Get)('/organizer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated) of an organizer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getOrganizerOwnEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('filter-by-status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated) based on status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_status_dto_1.EventStatusDTO, Number, Number]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getEventsByStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('filter-by-visibility'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events (paginated) based on visibility' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_visibility_dto_1.EventVisibilityDTO, Number, Number]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "filterEventsByVisibility", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('status-summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary of events based on status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status summary of events',
        type: status_summary_response_dto_1.EventsStatusSummaryResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "eventsStatusSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('visibility-summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary of events based on visibility' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Visibility summary of events',
        type: visibility_summary_response_dto_1.EventsVisibilitySummaryResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "eventsVisibilitySummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('event-type-summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary of events based on types' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Types summary of events',
        type: event_type_summary_response_dto_1.EventsTypesSummaryResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "eventsTypeSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, user_roles_1.Roles)('organizer', 'admin'),
    (0, common_1.Get)('tags-summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary of events based on tags' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tags summary of events',
        type: tags_summary_response_dto_1.EventsTagsSummaryResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "eventTagsSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Get)('upcoming-events'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all upcoming events (paginated)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of events',
        type: paginated_events_response_dto_1.PaginatedEventsResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "upcomingEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Post)('/publish/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Publish an event' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Event ID to be published',
        example: '65b12c8a9f4c2e001f3a9d21'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event Published',
        type: event_response_dto_1.EventResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "publishEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Post)('/cancel/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an event' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Event ID to be cancelled',
        example: '65b12c8a9f4c2e001f3a9d21'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event Cancelled',
        type: event_response_dto_1.EventResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "cancelEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Delete)('/delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete an event' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Event ID to be soft delete',
        example: '65b12c8a9f4c2e001f3a9d21'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event Deleted Successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "softDeleteEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Post)('/recover/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Recover an event' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Event ID to be recovered',
        example: '65b12c8a9f4c2e001f3a9d21'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event Recovered',
        type: event_response_dto_1.EventResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "recoverDeletedEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.EventOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, user_roles_1.Roles)('organizer'),
    (0, common_1.Delete)('/delete-permanent/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an event Permanently' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'Event ID to be permanently deleted',
        example: '65b12c8a9f4c2e001f3a9d21'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event Deleted Permanently'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "deleteEventPermanently", null);
__decorate([
    (0, common_1.Get)('internal/filter'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)('x-internal-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_query_dto_1.EventQueryDTO, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventsByFilter_Internal", null);
__decorate([
    (0, common_1.Get)('internal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-internal-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEvent_Internal", null);
exports.EventController = EventController = __decorate([
    (0, swagger_1.ApiTags)('Events'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)({ path: 'events', version: '1' }),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map