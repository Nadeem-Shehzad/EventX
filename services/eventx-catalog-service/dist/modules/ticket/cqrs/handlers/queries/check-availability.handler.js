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
exports.CheckAvailabilityHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const ticket_queries_1 = require("../../queries/ticket.queries");
const ticket_repository_1 = require("../../../ticket.repository");
const redis_service_1 = require("../../../../../redis/redis.service");
const common_1 = require("@nestjs/common");
let CheckAvailabilityHandler = class CheckAvailabilityHandler {
    ticketRepo;
    redis;
    constructor(ticketRepo, redis) {
        this.ticketRepo = ticketRepo;
        this.redis = redis;
    }
    async execute(query) {
        const { ticketTypeId, quantity } = query;
        const cacheKey = `availability:ticket:${ticketTypeId}`;
        const cached = await this.redis.get(cacheKey);
        if (cached !== null) {
            const available = parseInt(cached);
            return {
                available: available >= quantity,
                availableQuantity: available
            };
        }
        const ticket = await this.ticketRepo.findByIdNoSession(ticketTypeId);
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket Not Found');
        }
        await this.redis.set(cacheKey, ticket.availableQuantity.toString(), 60);
        return {
            available: ticket.availableQuantity >= quantity,
            availableQuantity: ticket.availableQuantity
        };
    }
};
exports.CheckAvailabilityHandler = CheckAvailabilityHandler;
exports.CheckAvailabilityHandler = CheckAvailabilityHandler = __decorate([
    (0, cqrs_1.QueryHandler)(ticket_queries_1.CheckAvailabilityQuery),
    __metadata("design:paramtypes", [ticket_repository_1.TicketRepository,
        redis_service_1.RedisService])
], CheckAvailabilityHandler);
//# sourceMappingURL=check-availability.handler.js.map