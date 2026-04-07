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
var TicketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const ticket_repository_1 = require("./ticket.repository");
const ticket_commands_1 = require("./cqrs/commands/ticket.commands");
const ticket_queries_1 = require("./cqrs/queries/ticket.queries");
const logger_service_1 = require("../../common/logger/logger.service");
let TicketService = TicketService_1 = class TicketService {
    ticketRepo;
    commandBus;
    queryBus;
    pinoLogger;
    logger = new common_1.Logger(TicketService_1.name);
    constructor(ticketRepo, commandBus, queryBus, pinoLogger) {
        this.ticketRepo = ticketRepo;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.pinoLogger = pinoLogger;
    }
    async createTickets(tickets, session) {
        await this.ticketRepo.createTickets(tickets, session);
    }
    async saveTickets(ticket, session) {
        return this.ticketRepo.saveTicket(ticket, session);
    }
    async updateOne(id, ticketType, sold, reserved, existingTicket, session) {
        await this.ticketRepo.updateOne(id, ticketType, sold, reserved, existingTicket, session);
    }
    async deleteManyTickets(eventId, session) {
        await this.ticketRepo.deleteManyTickets(eventId, session);
    }
    async findTicketById(id, session) {
        return this.ticketRepo.findById(id, session);
    }
    async findConflictingTicketName(eventId, name, excludeTicketId, session) {
        return this.ticketRepo.findConflictingTicketName(eventId, name, excludeTicketId, session);
    }
    async findTicketByName(eventId, name, session) {
        return this.ticketRepo.findTicketByName(eventId, name, session);
    }
    async reserveTickets(ticketTypeId, quantity, session) {
        try {
            const result = await this.commandBus.execute(new ticket_commands_1.ReserveTicketCommand(ticketTypeId, quantity, session));
            if (!result)
                throw new common_1.NotFoundException('Ticket not available or insufficient quantity');
            return result;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException)
                throw err;
            this.logger.error(`reserveTickets failed: ${err.message}`);
            throw new common_1.InternalServerErrorException('Failed to reserve tickets');
        }
    }
    async confirmReservedTickets(ticketTypeId, quantity, session) {
        try {
            const result = await this.commandBus.execute(new ticket_commands_1.ConfirmTicketCommand(ticketTypeId, quantity, session));
            if (!result)
                throw new common_1.NotFoundException('Reserved tickets not found');
            return result;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException)
                throw err;
            this.logger.error(`confirmReservedTickets failed: ${err.message}`);
            throw new common_1.InternalServerErrorException('Failed to confirm tickets');
        }
    }
    async releaseReservedTickets(ticketTypeId, quantity, session) {
        try {
            const result = await this.commandBus.execute(new ticket_commands_1.ReleasedReservedTicketCommand(ticketTypeId, quantity, session));
            if (!result)
                throw new common_1.NotFoundException('Reserved tickets not found');
            return result;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException)
                throw err;
            this.logger.error(`releaseReservedTickets failed: ${err.message}`);
            throw new common_1.InternalServerErrorException('Failed to release tickets');
        }
    }
    async getTicketsByEvent(eventId) {
        this.pinoLogger.info(`getTicketsByEvent Started`, { eventId: eventId.toString() });
        try {
            return await this.queryBus.execute(new ticket_queries_1.GetTicketsByEventQuery(eventId));
        }
        catch (err) {
            this.pinoLogger.error(`getTicketsByEvent failed`, { error: err.message.toString() });
            throw new common_1.InternalServerErrorException('Failed to fetch tickets');
        }
    }
    async getTicketByID(ticketTypeId) {
        this.pinoLogger.info(`getTicketByID Started`, { ticketTypeId: ticketTypeId.toString() });
        try {
            return await this.queryBus.execute(new ticket_queries_1.GetTicketByIdQuery(ticketTypeId));
        }
        catch (err) {
            this.logger.error(`getTicketByID failed: ${err.message}`);
            this.pinoLogger.error(`getTicketByID failed`, { error: err.message.toString() });
            throw new common_1.InternalServerErrorException('Failed to fetch ticket');
        }
    }
    async checkAvailability(ticketTypeId, quantity) {
        try {
            return await this.queryBus.execute(new ticket_queries_1.CheckAvailabilityQuery(ticketTypeId, quantity));
        }
        catch (err) {
            this.logger.error(`checkAvailability failed: ${err.message}`);
            throw new common_1.InternalServerErrorException('Failed to check ticket availability');
        }
    }
    async findTicketsByEvent(eventId) {
        return this.ticketRepo.findTicketsByEventId(eventId);
    }
    async findByIdNoSession(id) {
        return this.ticketRepo.findByIdNoSession(id);
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = TicketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ticket_repository_1.TicketRepository,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        logger_service_1.LoggerService])
], TicketService);
//# sourceMappingURL=ticket.service.js.map