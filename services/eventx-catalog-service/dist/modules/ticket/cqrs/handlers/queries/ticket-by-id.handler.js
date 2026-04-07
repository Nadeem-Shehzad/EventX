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
exports.TicketByIDHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const ticket_queries_1 = require("../../queries/ticket.queries");
const ticket_repository_1 = require("../../../ticket.repository");
const redis_service_1 = require("../../../../../redis/redis.service");
let TicketByIDHandler = class TicketByIDHandler {
    ticketRepo;
    redis;
    constructor(ticketRepo, redis) {
        this.ticketRepo = ticketRepo;
        this.redis = redis;
    }
    async execute(query) {
        const { ticketTypeId } = query;
        console.log(`=================================`);
        console.log(`== INSIDE TICKET BY ID HANDLER ==`);
        console.log(`=================================`);
        const chacheKey = `ticket:${ticketTypeId}`;
        const chache = await this.redis.get(chacheKey);
        if (chache) {
            return JSON.parse(chache);
        }
        const ticket = await this.ticketRepo.findByIdNoSession(ticketTypeId);
        await this.redis.set(chacheKey, JSON.stringify(ticket), 300);
        return ticket;
    }
};
exports.TicketByIDHandler = TicketByIDHandler;
exports.TicketByIDHandler = TicketByIDHandler = __decorate([
    (0, cqrs_1.QueryHandler)(ticket_queries_1.GetTicketByIdQuery),
    __metadata("design:paramtypes", [ticket_repository_1.TicketRepository,
        redis_service_1.RedisService])
], TicketByIDHandler);
//# sourceMappingURL=ticket-by-id.handler.js.map