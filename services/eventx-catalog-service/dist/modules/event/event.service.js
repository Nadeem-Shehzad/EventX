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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const slugify_1 = __importDefault(require("slugify"));
const class_transformer_1 = require("class-transformer");
const event_repository_1 = require("./event.repository");
const redis_service_1 = require("../../redis/redis.service");
const ticket_service_1 = require("../ticket/ticket.service");
const event_outbox_service_1 = require("./outbox/event-outbox.service");
const queue_constants_1 = require("../../queue/queue.constants");
const event_response_dto_1 = require("./dto/response/event-response.dto");
const logger_service_1 = require("../../common/logger/logger.service");
async function withCache(opts) {
    try {
        const cached = await opts.redis.get(opts.key);
        if (cached)
            return JSON.parse(cached);
    }
    catch (err) {
        opts.logger.warn(`Redis read failed for key ${opts.key}: ${err.message}`);
    }
    const result = await opts.fallbackFn();
    try {
        await opts.redis.set(opts.key, JSON.stringify(result), opts.ttlSeconds);
    }
    catch (err) {
        opts.logger.warn(`Redis write failed for key ${opts.key}: ${err.message}`);
    }
    return result;
}
async function enqueueFireAndForget(queue, jobName, data, logger, context) {
    queue
        .add(jobName, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
    })
        .catch(err => logger.error(`Queue enqueue failed [${context}]: ${err.message}`));
}
let EventService = EventService_1 = class EventService {
    connection;
    eventRepo;
    redis;
    imageQueue;
    ticketService;
    eventOutboxService;
    pinoLogger;
    logger = new common_1.Logger(EventService_1.name);
    constructor(connection, eventRepo, redis, imageQueue, ticketService, eventOutboxService, pinoLogger) {
        this.connection = connection;
        this.eventRepo = eventRepo;
        this.redis = redis;
        this.imageQueue = imageQueue;
        this.ticketService = ticketService;
        this.eventOutboxService = eventOutboxService;
        this.pinoLogger = pinoLogger;
    }
    async createEvent(organizerId, dto) {
        this.pinoLogger.info(`Create Event Started`, { title: dto.title.toString() });
        const session = await this.connection.startSession();
        session.startTransaction();
        this.pinoLogger.info(`DB Transaction started`, { title: dto.title.toString() });
        try {
            const existingEvent = await this.eventRepo.checkEventExist(organizerId, dto);
            if (existingEvent) {
                this.pinoLogger.warn(`Event with same title, date and venue already exists`, { title: dto.title.toString() });
                throw new common_1.ConflictException('Event with same title, date and venue already exists');
            }
            this.pinoLogger.info(`No Event with same title, date and venue exists`);
            const slug = `${(0, slugify_1.default)(dto.title, { lower: true })}-${Date.now()}`;
            const dataObject = { ...dto, organizerId, slug };
            const event = await this.eventRepo.create(dataObject, session);
            this.pinoLogger.info(`Event Created`, { title: dto.title.toString() });
            const ticketTypesData = dto.ticketTypes.map(tt => ({
                ...tt,
                eventId: event._id,
                availableQuantity: tt.totalQuantity,
            }));
            await this.ticketService.createTickets(ticketTypesData, session);
            this.pinoLogger.info(`Tickets Created for event`, { title: dto.title.toString() });
            await session.commitTransaction();
            return {
                eventId: event._id.toString(),
                message: 'Event created successfully',
            };
        }
        catch (err) {
            this.pinoLogger.error(`Error in creating event`, { title: dto.title.toString() });
            await session.abortTransaction();
            throw err;
        }
        finally {
            session.endSession();
        }
    }
    async updateEvent(eventId, dataToUpdate) {
        this.pinoLogger.info(`updateEvent Started`, { eventId: eventId.toString() });
        const event = await this.eventRepo.findEventById(eventId);
        if (!event) {
            this.pinoLogger.error('Event not found', { eventId: eventId.toString() });
            throw new common_1.NotFoundException('Event not found');
        }
        if (dataToUpdate.title) {
            dataToUpdate.slug = (0, slugify_1.default)(dataToUpdate.title, { lower: true });
        }
        const newImagePublicId = dataToUpdate.bannerImage?.publicId;
        const oldImagePublicId = event.bannerImage?.publicId;
        const session = await this.connection.startSession();
        session.startTransaction();
        this.pinoLogger.info(`DB session Started`, { eventId: eventId.toString() });
        try {
            if (dataToUpdate.ticketTypes?.length) {
                for (const tt of dataToUpdate.ticketTypes) {
                    if (tt._id) {
                        const existingTicket = await this.ticketService.findTicketById(tt._id, session);
                        if (!existingTicket)
                            throw new common_1.NotFoundException(`Ticket type not found: ${tt._id}`);
                        const { soldQuantity: sold, reservedQuantity: reserved } = existingTicket;
                        if (tt.totalQuantity !== undefined && tt.totalQuantity < sold + reserved) {
                            throw new common_1.BadRequestException('Total quantity cannot be less than sold + reserved');
                        }
                        if (tt.name && tt.name !== existingTicket.name) {
                            const conflict = await this.ticketService.findConflictingTicketName(eventId, tt.name, tt._id, session);
                            if (conflict) {
                                throw new common_1.ConflictException(`Ticket type name "${tt.name}" already exists for this event`);
                            }
                        }
                    }
                    else {
                        if (tt.name) {
                            const conflict = await this.ticketService.findTicketByName(eventId, tt.name, session);
                            if (conflict) {
                                throw new common_1.ConflictException(`Ticket type name "${tt.name}" already exists for this event`);
                            }
                        }
                        const ticket = {
                            name: tt.name,
                            eventId: new mongoose_2.Types.ObjectId(eventId),
                            totalQuantity: tt.totalQuantity,
                            availableQuantity: tt.totalQuantity,
                            price: tt.price,
                            isPaidEvent: tt.isPaidEvent,
                            currency: tt.currency,
                        };
                        await this.ticketService.saveTickets(ticket, session);
                    }
                }
            }
            const result = await this.eventRepo.updateEvent(eventId, dataToUpdate, session);
            await session.commitTransaction();
            this.pinoLogger.info(`DB Transaction committed `, { eventId: eventId.toString() });
            if (newImagePublicId && newImagePublicId !== oldImagePublicId && oldImagePublicId) {
                enqueueFireAndForget(this.imageQueue, 'delete-old-event-image', { publicId: oldImagePublicId, eventId }, this.logger, 'updateEvent.deleteOldImage');
            }
            result
                ? this.pinoLogger.info(`Event updated successfully`, { eventId: eventId.toString() })
                : this.pinoLogger.info(`Event not updated`, { eventId: eventId.toString() });
            return result ? 'Event updated successfully' : 'Event not updated';
        }
        catch (err) {
            this.pinoLogger.error(`Error in updating event`, { eventId: eventId.toString() });
            await session.abortTransaction();
            throw err;
        }
        finally {
            session.endSession();
        }
    }
    async getAllEventsByAggregate(page = 1, limit = 10) {
        return withCache({
            key: `all-events-${page}-${limit}`,
            ttlSeconds: 60,
            redis: this.redis,
            logger: this.logger,
            fallbackFn: async () => {
                const { events, total } = await this.eventRepo.getEventsByAggregation(page, limit);
                return {
                    events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
                    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
                };
            },
        });
    }
    async getEventsByFilter(query) {
        const { category, tags, city, search, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const filters = { status: 'published', isDeleted: false };
        if (category)
            filters.category = category;
        if (tags?.length)
            filters.tags = { $in: tags };
        if (city)
            filters['location.city'] = city;
        if (search)
            filters.title = { $regex: search, $options: 'i' };
        return this.eventRepo.getEventsByFilter(filters, { limit, skip });
    }
    async getFreeEvents(page = 1, limit = 10) {
        return withCache({
            key: `free-events-${page}-${limit}`,
            ttlSeconds: 60,
            redis: this.redis,
            logger: this.logger,
            fallbackFn: async () => {
                const { events, total } = await this.eventRepo.getFreeEvents(page, limit);
                return {
                    events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
                    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
                };
            },
        });
    }
    async getPaidEvents(page = 1, limit = 10) {
        return withCache({
            key: `paid-events-${page}-${limit}`,
            ttlSeconds: 120,
            redis: this.redis,
            logger: this.logger,
            fallbackFn: async () => {
                const { events, total } = await this.eventRepo.getPaidEvents(page, limit);
                return {
                    events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
                    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
                };
            },
        });
    }
    async getUpcomingEvents(page = 1, limit = 10) {
        return withCache({
            key: `upcoming-events-${page}-${limit}`,
            ttlSeconds: 60,
            redis: this.redis,
            logger: this.logger,
            fallbackFn: async () => {
                const { events, total } = await this.eventRepo.getUpcomingEvents(page, limit);
                return {
                    events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
                    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
                };
            },
        });
    }
    async getOrganizerEvents(id, page = 1, limit = 10) {
        const { events, total } = await this.eventRepo.getOrganizerEvents(id, page, limit);
        return {
            events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOrganizerOwnEvents(id, page = 1, limit = 10) {
        const { events, total } = await this.eventRepo.getOrganizerOwnEvents(id, page, limit);
        return {
            events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async publishEvent(eventId, organizerId) {
        const result = await this.eventRepo.publishEvent(eventId, organizerId);
        if (!result) {
            throw new common_1.BadRequestException('Event cannot be published or you are not authorized');
        }
        return (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
    }
    async cancelEvent(eventId, organizerId) {
        const result = await this.eventRepo.cancelEvent(eventId, organizerId);
        if (!result) {
            throw new common_1.BadRequestException('Event cannot be cancelled or you are not authorized');
        }
        return (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
    }
    async softDeleteEvent(eventId, organizerId) {
        const result = await this.eventRepo.softDeleteEvent(eventId, organizerId);
        if (!result) {
            throw new common_1.BadRequestException('Event cannot be deleted or you are not authorized');
        }
        return { message: 'Event deleted successfully' };
    }
    async recoverDeletedEvent(eventId, organizerId) {
        const result = await this.eventRepo.recoverDeletedEvent(eventId, organizerId);
        if (!result) {
            throw new common_1.BadRequestException('Event cannot be recovered or you are not authorized');
        }
        return (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, result.toObject(), { excludeExtraneousValues: true });
    }
    async deleteEventPermanently(eventId, organizerId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const deletedEvent = await this.eventRepo.deleteEventPermanently(eventId, organizerId, session);
            if (!deletedEvent) {
                throw new common_1.BadRequestException('Event cannot be permanently deleted or you are not authorized');
            }
            await this.ticketService.deleteManyTickets(eventId, session);
            await session.commitTransaction();
            if (deletedEvent.bannerImage?.publicId) {
                enqueueFireAndForget(this.imageQueue, 'delete-event-image', { publicId: deletedEvent.bannerImage.publicId, eventId }, this.logger, 'deleteEventPermanently.deleteImage');
            }
            return { message: 'Event deleted permanently' };
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            session.endSession();
        }
    }
    async filterEventsByStatus(status, page = 1, limit = 10) {
        const { events, total } = await this.eventRepo.filterEventsByStatus(status, page, limit);
        return {
            events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async filterEventsByVisibility(visibility, page = 1, limit = 10) {
        const { events, total } = await this.eventRepo.filterEventsByVisibility(visibility, page, limit);
        return {
            events: (0, class_transformer_1.plainToInstance)(event_response_dto_1.EventResponseDTO, events, { excludeExtraneousValues: true }),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async eventStatusSummary() { return this.eventRepo.eventStatusSummary(); }
    async eventVisibilitySummary() { return this.eventRepo.eventVisibilitySummary(); }
    async eventTypeSummary() { return this.eventRepo.eventTypeSummary(); }
    async eventTagsSummary() { return this.eventRepo.eventTagsSummary(); }
    async findById(id) {
        return this.eventRepo.findEventById(id);
    }
    async findEventOwner(id) {
        return this.eventRepo.findEventOwner(id);
    }
    async deleteEventById(eventId) {
        const result = await this.eventRepo.deleteEventHard(eventId);
        if (!result)
            throw new common_1.NotFoundException('Event not found');
        return result;
    }
};
exports.EventService = EventService;
exports.EventService = EventService = EventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(3, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUES.EVENT_IMAGE)),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        event_repository_1.EventRepository,
        redis_service_1.RedisService,
        bullmq_2.Queue,
        ticket_service_1.TicketService,
        event_outbox_service_1.EventOutboxService,
        logger_service_1.LoggerService])
], EventService);
//# sourceMappingURL=event.service.js.map