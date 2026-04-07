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
exports.TicketRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_pipeline_1 = require("../../common/base/base.pipeline");
const db_error_util_1 = require("../../common/utils/db-error.util");
let TicketRepository = class TicketRepository extends base_pipeline_1.BasePipeline {
    ticketModel;
    constructor(ticketModel) {
        super(ticketModel);
        this.ticketModel = ticketModel;
    }
    async createTickets(data, session) {
        try {
            return await this.ticketModel.insertMany(data, { session, ordered: true });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.createTickets');
        }
    }
    async saveTicket(data, session) {
        try {
            const result = await this.ticketModel.create([data], { session });
            return result[0];
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.saveTicket');
        }
    }
    async updateOne(id, ticketType, sold, reserved, existingTicket, session) {
        try {
            await this.ticketModel.updateOne({ _id: id }, {
                $set: {
                    ...ticketType,
                    availableQuantity: ticketType.totalQuantity !== undefined
                        ? ticketType.totalQuantity - sold - reserved
                        : existingTicket.availableQuantity,
                },
            }, { session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.updateOne');
        }
    }
    async deleteManyTickets(eventId, session) {
        try {
            await this.ticketModel.deleteMany({ eventId: new mongoose_2.Types.ObjectId(eventId) }).session(session);
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.deleteManyTickets');
        }
    }
    async ticketReserve(ticketTypeId, quantity, session) {
        try {
            return await this.ticketModel.findOneAndUpdate({ _id: ticketTypeId, availableQuantity: { $gte: quantity } }, { $inc: { reservedQuantity: quantity, availableQuantity: -quantity } }, { new: true, session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.ticketReserve');
        }
    }
    async confirmReservedTickets(ticketTypeId, quantity, session) {
        try {
            return await this.ticketModel.findOneAndUpdate({ _id: ticketTypeId, reservedQuantity: { $gte: quantity } }, { $inc: { reservedQuantity: -quantity, soldQuantity: quantity } }, { new: true, session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.confirmReservedTickets');
        }
    }
    async releaseReservedTickets(ticketTypeId, quantity, session) {
        try {
            return await this.ticketModel.findOneAndUpdate({ _id: ticketTypeId, reservedQuantity: { $gte: quantity } }, { $inc: { reservedQuantity: -quantity, availableQuantity: quantity } }, { new: true, session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.releaseReservedTickets');
        }
    }
    async findById(id, session) {
        try {
            return await this.ticketModel.findById(id).session(session);
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.findById');
        }
    }
    async findConflictingTicketName(eventId, name, excludeTicketId, session) {
        try {
            return await this.ticketModel.findOne({
                eventId,
                name,
                _id: { $ne: excludeTicketId },
            }).session(session);
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.findConflictingTicketName');
        }
    }
    async findTicketByName(eventId, name, session) {
        try {
            return await this.ticketModel.findOne({ eventId, name }).session(session);
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.findTicketByName');
        }
    }
    async findTicketsByEventId(eventId) {
        return this.safeQuery(() => this.ticketModel.find({
            eventId: new mongoose_2.Types.ObjectId(eventId),
            isActive: true,
        }).lean().exec(), {
            fallback: [],
            context: 'TicketRepository.findTicketsByEventId'
        });
    }
    async findByIdNoSession(id) {
        try {
            return await this.safeQuery(() => this.ticketModel.findById(id).exec(), { context: 'TicketRepository.findByIdNoSession' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'TicketRepository.findByIdNoSession');
        }
    }
};
exports.TicketRepository = TicketRepository;
exports.TicketRepository = TicketRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('TicketType')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TicketRepository);
//# sourceMappingURL=ticket.repository.js.map