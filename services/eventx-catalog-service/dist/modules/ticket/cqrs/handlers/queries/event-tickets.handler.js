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
exports.GetTicketsByEventHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const ticket_queries_1 = require("../../queries/ticket.queries");
const ticket_repository_1 = require("../../../ticket.repository");
const redis_service_1 = require("../../../../../redis/redis.service");
let GetTicketsByEventHandler = class GetTicketsByEventHandler {
    ticketRepo;
    redis;
    constructor(ticketRepo, redis) {
        this.ticketRepo = ticketRepo;
        this.redis = redis;
    }
    async execute(query) {
        const { eventId } = query;
        console.log(`====================================`);
        console.log(`== INSIDE TICKET BY EVENT HANDLER ==`);
        console.log(`eventID --> ${eventId}`);
        console.log(`====================================`);
        const chacheKey = `tickets:event:${eventId}`;
        const chache = await this.redis.get(chacheKey);
        if (chache) {
            console.log('inside cahche');
            return JSON.parse(chache);
        }
        console.log('outside cahche');
        const tickets = await this.ticketRepo.findTicketsByEventId(eventId);
        await this.redis.set(chacheKey, JSON.stringify(tickets), 10);
        return tickets;
    }
};
exports.GetTicketsByEventHandler = GetTicketsByEventHandler;
exports.GetTicketsByEventHandler = GetTicketsByEventHandler = __decorate([
    (0, cqrs_1.QueryHandler)(ticket_queries_1.GetTicketsByEventQuery),
    __metadata("design:paramtypes", [ticket_repository_1.TicketRepository,
        redis_service_1.RedisService])
], GetTicketsByEventHandler);
//# sourceMappingURL=event-tickets.handler.js.map