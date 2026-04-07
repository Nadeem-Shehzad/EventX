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
exports.EventResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const event_type_1 = require("./dto/event.type");
const event_service_1 = require("./event.service");
const ticket_type_1 = require("./dto/ticket.type");
const organizer_type_1 = require("./dto/organizer.type");
const event_list_type_1 = require("./dto/event-list.type");
const event_filter_type_dto_1 = require("./dto/event-filter.type.dto");
let EventResolver = class EventResolver {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async event(id) {
        return this.eventService.getEvent(id);
    }
    async tickets(event) {
        return this.eventService.getTickets(event.id);
    }
    async organizer(event) {
        return this.eventService.getOrganizer(event.organizerId);
    }
    async events(filter, page, limit) {
        return this.eventService.getEvents(filter ?? {}, page, limit);
    }
};
exports.EventResolver = EventResolver;
__decorate([
    (0, graphql_1.Query)(() => event_type_1.Event, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventResolver.prototype, "event", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [ticket_type_1.Ticket]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_type_1.Event]),
    __metadata("design:returntype", Promise)
], EventResolver.prototype, "tickets", null);
__decorate([
    (0, graphql_1.ResolveField)(() => organizer_type_1.Organizer),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_type_1.Event]),
    __metadata("design:returntype", Promise)
], EventResolver.prototype, "organizer", null);
__decorate([
    (0, graphql_1.Query)(() => event_list_type_1.EventsList),
    __param(0, (0, graphql_1.Args)('filter', { nullable: true })),
    __param(1, (0, graphql_1.Args)('page', { type: () => graphql_1.Int, nullable: true, defaultValue: 1 })),
    __param(2, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true, defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_filter_type_dto_1.EventFilterInput, Number, Number]),
    __metadata("design:returntype", Promise)
], EventResolver.prototype, "events", null);
exports.EventResolver = EventResolver = __decorate([
    (0, graphql_1.Resolver)(() => event_type_1.Event),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventResolver);
//# sourceMappingURL=event.resolver.js.map