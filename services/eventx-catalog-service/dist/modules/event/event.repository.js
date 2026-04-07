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
exports.administrativeResponseData = exports.publicResponseData = exports.EventRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_enums_1 = require("./enums/event.enums");
const base_pipeline_1 = require("../../common/base/base.pipeline");
const db_error_util_1 = require("../../common/utils/db-error.util");
let EventRepository = class EventRepository extends base_pipeline_1.BasePipeline {
    eventModel;
    constructor(eventModel) {
        super(eventModel);
        this.eventModel = eventModel;
    }
    async create(data, session) {
        try {
            const result = await this.eventModel.create([data], { session, ordered: true });
            return result[0];
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.create');
        }
    }
    async updateEvent(id, dataToUpdate, session) {
        try {
            return await this.eventModel.findOneAndUpdate({ _id: id }, { $set: dataToUpdate }, { new: true, session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.updateEvent');
        }
    }
    async deleteEventPermanently(eventId, organizerId, session) {
        try {
            return await this.eventModel.findOneAndDelete({ _id: eventId, organizerId, isDeleted: true }, { session });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.deleteEventPermanently');
        }
    }
    async checkEventExist(organizerId, data) {
        try {
            return await this.safeQuery(() => this.eventModel.findOne({
                organizerId,
                title: data.title,
                startDateTime: data.startDateTime,
                'location.venueName': data.location?.venueName,
                'location.city': data.location?.city,
                'location.country': data.location?.country,
            }).exec(), { context: 'EventRepository.checkEventExist' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.checkEventExist');
        }
    }
    async findEventById(id) {
        try {
            return await this.safeQuery(() => this.eventModel.findById(id).lean().exec(), { context: 'EventRepository.findEventById' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.findEventById');
        }
    }
    async publishEvent(eventId, organizerId) {
        try {
            return await this.safeQuery(() => this.eventModel.findOneAndUpdate({ _id: eventId, organizerId, status: 'draft' }, { $set: { status: 'published' } }, { new: true }).exec(), { retry: false, context: 'EventRepository.publishEvent' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.publishEvent');
        }
    }
    async cancelEvent(eventId, organizerId) {
        try {
            return await this.safeQuery(() => this.eventModel.findOneAndUpdate({ _id: eventId, organizerId, status: { $in: ['draft', 'published'] } }, { $set: { status: 'cancelled' } }, { new: true }).exec(), { retry: false, context: 'EventRepository.cancelEvent' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.cancelEvent');
        }
    }
    async softDeleteEvent(eventId, organizerId) {
        try {
            return await this.safeQuery(() => this.eventModel.findOneAndUpdate({ _id: eventId, organizerId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true }).exec(), { retry: false, context: 'EventRepository.softDeleteEvent' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.softDeleteEvent');
        }
    }
    async recoverDeletedEvent(eventId, organizerId) {
        try {
            return await this.safeQuery(() => this.eventModel.findOneAndUpdate({ _id: eventId, organizerId, isDeleted: true }, { $set: { isDeleted: false, deletedAt: null } }, { new: true }).exec(), { retry: false, context: 'EventRepository.recoverDeletedEvent' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.recoverDeletedEvent');
        }
    }
    async deleteEventHard(eventId) {
        try {
            return await this.safeQuery(() => this.eventModel.findByIdAndDelete(eventId).exec(), { retry: false, context: 'EventRepository.deleteEventHard' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'EventRepository.deleteEventHard');
        }
    }
    async getEventsByAggregation(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: { status: 'published', isDeleted: false } },
            { $sort: { startDateTime: 1 } },
            {
                $facet: {
                    events: [
                        { $skip: skip },
                        { $limit: limit },
                        { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                        { $project: { ...exports.publicResponseData, ticketTypes: ticketTypeProjection } },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.count ?? 0,
        })), {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getEventsByAggregation'
        });
    }
    async getEventsByFilter(filters, options) {
        const pipeline = [
            { $match: filters },
            { $sort: { startDateTime: 1 } },
            {
                $facet: {
                    data: [
                        { $skip: options.skip },
                        { $limit: options.limit },
                        { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                        { $project: { ...exports.publicResponseData, ticketTypes: ticketTypeProjection } },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec().then(result => {
            const events = result[0]?.data ?? [];
            const total = result[0]?.totalCount?.[0]?.count ?? 0;
            return {
                events,
                meta: {
                    total,
                    page: Math.floor(options.skip / options.limit) + 1,
                    limit: options.limit,
                    totalPages: Math.ceil(total / options.limit),
                },
            };
        }), {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], meta: { total: 0, page: 1, limit: options.limit, totalPages: 0 } },
            context: 'EventRepository.getEventsByFilter'
        });
    }
    async getFreeEvents(page = 1, limit = 10) {
        return this.runPagedAggregation({ status: 'published', isDeleted: false, isPaid: false }, page, limit, 'EventRepository.getFreeEvents');
    }
    async getPaidEvents(page = 1, limit = 10) {
        return this.runPagedAggregation({ status: 'published', isDeleted: false, isPaid: true }, page, limit, 'EventRepository.getPaidEvents');
    }
    async getUpcomingEvents(page = 1, limit = 10) {
        return this.runPagedAggregation({ status: 'published', isDeleted: false, startDateTime: { $gte: new Date() } }, page, limit, 'EventRepository.getUpcomingEvents');
    }
    async getOrganizerEvents(id, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: { organizerId: new mongoose_2.Types.ObjectId(id), isDeleted: false } },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    events: [
                        { $skip: skip },
                        { $limit: limit },
                        { $lookup: { from: 'users', localField: 'organizerId', foreignField: '_id', pipeline: [{ $project: { name: 1 } }], as: 'organizer' } },
                        { $unwind: { path: '$organizer', preserveNullAndEmptyArrays: true } },
                        { $project: exports.administrativeResponseData },
                    ],
                    totalCount: [{ $count: 'total' }],
                },
            },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.total ?? 0,
        })), {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getOrganizerEvents'
        });
    }
    async getOrganizerOwnEvents(id, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: { organizerId: new mongoose_2.Types.ObjectId(id) } },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    events: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: exports.publicResponseData },
                    ],
                    totalCount: [{ $count: 'total' }],
                },
            },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.total ?? 0,
        })), {
            timeoutMs: 15000,
            retry: false,
            fallback: { events: [], total: 0 },
            context: 'EventRepository.getOrganizerOwnEvents'
        });
    }
    async filterEventsByStatus(status, page = 1, limit = 10) {
        return this.runPagedAggregation({ status, isDeleted: false }, page, limit, 'EventRepository.filterEventsByStatus');
    }
    async filterEventsByVisibility(visibility, page = 1, limit = 10) {
        return this.runPagedAggregation({ visibility, isDeleted: false }, page, limit, 'EventRepository.filterEventsByVisibility');
    }
    async eventStatusSummary() {
        return this.runSummaryAggregation('$status', 'status', 'EventRepository.eventStatusSummary');
    }
    async eventVisibilitySummary() {
        return this.runSummaryAggregation('$visibility', 'visibility', 'EventRepository.eventVisibilitySummary');
    }
    async eventTypeSummary() {
        return this.runSummaryAggregation('$eventType', 'eventType', 'EventRepository.eventTypeSummary');
    }
    async eventTagsSummary() {
        const pipeline = [
            { $match: { isDeleted: false } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', total: { $sum: 1 } } },
            { $sort: { total: 1 } },
            { $project: { _id: 0, tag: '$_id', total: 1 } },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec(), {
            timeoutMs: 15000,
            retry: false,
            fallback: [],
            context: 'EventRepository.eventTagsSummary'
        });
    }
    async findEventOwner(eventId) {
        return this.safeQuery(() => this.eventModel.aggregate([
            { $match: { _id: new mongoose_2.Types.ObjectId(eventId) } },
            { $project: { organizerId: 1 } },
        ]).exec().then(r => r[0] ?? null), {
            timeoutMs: 5000,
            retry: false,
            fallback: null,
            context: 'EventRepository.findEventOwner'
        });
    }
    async runPagedAggregation(match, page, limit, context) {
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: match },
            { $sort: { startDateTime: 1 } },
            {
                $facet: {
                    events: [
                        { $skip: skip },
                        { $limit: limit },
                        { $lookup: { from: 'tickettypes', localField: '_id', foreignField: 'eventId', as: 'ticketTypes' } },
                        { $project: { ...exports.publicResponseData, ticketTypes: ticketTypeProjection } },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec().then(result => ({
            events: result[0]?.events ?? [],
            total: result[0]?.totalCount?.[0]?.count ?? 0,
        })), { timeoutMs: 15000, retry: false, fallback: { events: [], total: 0 }, context });
    }
    async runSummaryAggregation(groupField, projectField, context) {
        const pipeline = [
            { $match: { isDeleted: false } },
            { $group: { _id: groupField, total: { $sum: 1 } } },
            { $sort: { total: 1 } },
            { $project: { _id: 0, [projectField]: '$_id', total: 1 } },
        ];
        return this.safeQuery(() => this.eventModel.aggregate(pipeline).exec(), { timeoutMs: 15000, retry: false, fallback: [], context });
    }
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Event')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EventRepository);
const ticketTypeProjection = {
    name: 1,
    totalQuantity: 1,
    soldQuantity: 1,
    reservedQuantity: 1,
    price: 1,
    currency: 1,
    isPaidEvent: 1,
};
exports.publicResponseData = {
    _id: { $toString: '$_id' },
    title: 1,
    description: 1,
    category: 1,
    tags: 1,
    eventType: 1,
    location: {
        $cond: [{ $ne: ['$eventType', event_enums_1.EventType.ONLINE] }, '$location', '$$REMOVE']
    },
    bannerImage: 1,
    startDateTime: 1,
    endDateTime: 1,
    timezone: 1,
    capacity: 1,
    registeredCount: 1,
    isPaid: 1,
};
exports.administrativeResponseData = {
    _id: { $toString: '$_id' },
    title: 1,
    description: 1,
    category: 1,
    tags: 1,
    eventType: 1,
    location: {
        $cond: [{ $ne: ['$eventType', event_enums_1.EventType.ONLINE] }, '$location', '$$REMOVE']
    },
    bannerImage: 1,
    startDateTime: 1,
    endDateTime: 1,
    timezone: 1,
    capacity: 1,
    registeredCount: 1,
    isPaid: 1,
    priceRange: {
        $cond: [{ $eq: ['$isPaid', true] }, '$priceRange', '$$REMOVE']
    },
    organizer: { name: '$organizer.name' },
};
//# sourceMappingURL=event.repository.js.map