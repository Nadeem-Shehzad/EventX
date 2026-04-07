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
exports.ReserveTicketHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const ticket_commands_1 = require("../../commands/ticket.commands");
const ticket_repository_1 = require("../../../ticket.repository");
const redis_service_1 = require("../../../../../redis/redis.service");
const common_1 = require("@nestjs/common");
let ReserveTicketHandler = class ReserveTicketHandler {
    ticketRepo;
    redis;
    constructor(ticketRepo, redis) {
        this.ticketRepo = ticketRepo;
        this.redis = redis;
    }
    async execute(command) {
        const { ticketTypeId, quantity, session } = command;
        const ticketType = await this.ticketRepo.ticketReserve(ticketTypeId, quantity, session);
        if (!ticketType) {
            throw new common_1.BadRequestException('Tickets not available');
        }
        await this.redis.decrby(`availability:ticket:${ticketTypeId}`, quantity);
        await this.redis.del(`tickets:event:${ticketType.eventId.toString()}`);
        return ticketType;
    }
};
exports.ReserveTicketHandler = ReserveTicketHandler;
exports.ReserveTicketHandler = ReserveTicketHandler = __decorate([
    (0, cqrs_1.CommandHandler)(ticket_commands_1.ReserveTicketCommand),
    __metadata("design:paramtypes", [ticket_repository_1.TicketRepository,
        redis_service_1.RedisService])
], ReserveTicketHandler);
//# sourceMappingURL=reserve-ticket.handler.js.map