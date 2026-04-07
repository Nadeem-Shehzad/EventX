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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const http_service_1 = require("../../common/http/http.service");
let EventService = class EventService {
    http;
    constructor(http) {
        this.http = http;
    }
    async getEvent(id) {
        const data = await this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/${id}`);
        return { ...data, id: id };
    }
    async getOrganizer(organizerId) {
        if (!organizerId)
            return null;
        const data = await this.http.get(`${process.env.IDENTITY_SERVICE_URL}/users/internal/${organizerId}`);
        return {
            ...data,
            id: organizerId,
        };
    }
    async getTickets(eventId) {
        return await this.http.get(`${process.env.CATALOG_SERVICE_URL}/tickets/event/${eventId}`);
    }
    async getEvents(filter, page = 1, limit = 10) {
        const params = new URLSearchParams();
        if (filter.city)
            params.append('city', filter.city);
        if (filter.category)
            params.append('category', filter.category);
        if (filter.search)
            params.append('search', filter.search);
        if (filter.tags)
            params.append('tags', filter.tags);
        params.append('page', String(page));
        params.append('limit', String(limit));
        const data = await this.http.get(`${process.env.CATALOG_SERVICE_URL}/events/internal/filter?${params.toString()}`);
        return {
            data: data.events.map(e => ({ ...e, id: e._id?.toString() })),
            total: data.events.length,
            page,
            limit,
        };
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], EventService);
//# sourceMappingURL=event.service.js.map