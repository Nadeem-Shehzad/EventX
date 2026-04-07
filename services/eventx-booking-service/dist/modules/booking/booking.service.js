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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const booking_repository_1 = require("./repository/booking.repository");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const booking_status_enum_1 = require("./enum/booking-status.enum");
const class_transformer_1 = require("class-transformer");
const booking_response_dto_1 = require("./dto/booking.response.dto");
const redis_service_1 = require("../../redis/redis.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const payment_status_enum_1 = require("../../constants/payment-status.enum");
const email_queue_constants_1 = require("../../constants/email-queue.constants");
const outbox_service_1 = require("../../outbox/outbox.service");
const domain_events_1 = require("../../constants/events/domain-events");
const domain_aggregate_1 = require("../../constants/events/domain-aggregate");
const metrics_service_1 = require("../../monitoring/metrics.service");
const notification_outbox_service_1 = require("./outbox/notification/notification-outbox.service");
const identity_client_1 = require("../../clients/identity/identity.client");
const event_client_1 = require("../../clients/catalog/event.client");
const logger_service_1 = require("../../common/logger/logger.service");
let BookingService = class BookingService {
    constructor(connection, bookingRepo, notificationOutboxService, identityClient, eventClient, redis, eventEmitter, outboxService, pinoLogger, matricsService) {
        this.connection = connection;
        this.bookingRepo = bookingRepo;
        this.notificationOutboxService = notificationOutboxService;
        this.identityClient = identityClient;
        this.eventClient = eventClient;
        this.redis = redis;
        this.eventEmitter = eventEmitter;
        this.outboxService = outboxService;
        this.pinoLogger = pinoLogger;
        this.matricsService = matricsService;
    }
    async createBooking(userId, dto) {
        console.log('Inside create-booking');
        this.pinoLogger.info('createBooking attempt started', { userId: userId.toString(), eventId: dto.eventId.toString() });
        const existingBooking = await this.bookingRepo.checkBookingExists(userId, dto.eventId, dto.ticketTypeId);
        if (existingBooking) {
            this.pinoLogger.error('You already have an active booking for this event!', { userId: userId.toString(), eventId: dto.eventId.toString() });
            throw new common_1.ConflictException('You already have an active booking for this event!');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            let status = booking_status_enum_1.BookingStatus.PENDING;
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const booking = await this.bookingRepo.createBooking({
                userId: new mongoose_1.Types.ObjectId(userId),
                eventId: new mongoose_1.Types.ObjectId(dto.eventId),
                ticketTypeId: new mongoose_1.Types.ObjectId(dto.ticketTypeId),
                quantity: dto.quantity,
                amount: 0,
                currency: 'PKR',
                status,
                expiresAt,
            }, session);
            const payload = {
                bookingId: booking.id,
                userId,
                eventId: booking.eventId.toString(),
                ticketTypeId: dto.ticketTypeId,
                quantity: booking.quantity
            };
            await this.outboxService.addEvent('Booking', booking.id, domain_events_1.DOMAIN_EVENTS.BOOKING_CREATED, payload, session);
            await session.commitTransaction();
            this.eventEmitter.emit(email_queue_constants_1.BookingJob.BOOKING_CREATED, {
                bookingId: booking._id.toString(),
                eventId: booking.eventId.toString(),
                userId
            });
            this.pinoLogger.info('booking created', { userId: userId.toString(), eventId: dto.eventId.toString() });
            return { bookingId: booking._id.toString(), status: 'PENDING' };
        }
        catch (error) {
            this.pinoLogger.error('Booking not creating for this event!', { userId: userId.toString(), eventId: dto.eventId.toString() });
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getAllBookings(page = 1, limit = 10) {
        const cacheKey = `all-bookings:${page}-${limit}`;
        const cachedData = await this.redis.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        const { bookings, meta } = await this.bookingRepo.allBookings(page, limit);
        const result = (0, class_transformer_1.plainToInstance)(booking_response_dto_1.BookingResponseDTO, bookings, {
            excludeExtraneousValues: true
        });
        const finalResult = { bookings: result, meta };
        await this.redis.set(cacheKey, JSON.stringify(finalResult), 60);
        return finalResult;
    }
    async bookingByFilter(query) {
        const { userId, eventId, status, dateFrom, dateTo, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (userId)
            filter.userId = userId;
        if (eventId)
            filter.eventId = new mongoose_1.Types.ObjectId(eventId);
        if (status)
            filter.status = status;
        if (dateFrom)
            filter.dateFrom = dateFrom;
        if (dateTo)
            filter.dateTo = dateTo;
        return await this.bookingRepo.getBookingsByFilter(filter, { limit, skip });
    }
    async getOneBooking(id) {
        const booking = await this.bookingRepo.findBookingById(id);
        const finalResult = (0, class_transformer_1.plainToInstance)(booking_response_dto_1.BookingResponseDTO, booking, {
            excludeExtraneousValues: true
        });
        return finalResult;
    }
    async getEventBookings(eventId, page, limit) {
        const chacheKey = `event-bookings:${eventId}-${page}-${limit}`;
        const chacheData = await this.redis.get(chacheKey);
        if (chacheData) {
            return JSON.parse(chacheData);
        }
        const { bookings, meta } = await this.bookingRepo.findBookingsByEventId(eventId, page, limit);
        const result = (0, class_transformer_1.plainToInstance)(booking_response_dto_1.BookingResponseDTO, bookings, {
            excludeExtraneousValues: true
        });
        const finalResult = { bookings: result, meta };
        await this.redis.set(chacheKey, JSON.stringify(finalResult), 60);
        return finalResult;
    }
    async getUserBookings(userId, page, limit) {
        const { bookings, meta } = await this.bookingRepo.findBookingsByUserId(userId, page, limit);
        const result = (0, class_transformer_1.plainToInstance)(booking_response_dto_1.BookingResponseDTO, bookings, {
            excludeExtraneousValues: true
        });
        const finalResult = { bookings: result, meta };
        return finalResult;
    }
    async confirmBookingRequest(bookingId, paymentIntentId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const booking = await this.bookingRepo.findBookingById(bookingId);
            if (!booking)
                throw new common_1.NotFoundException('Booking Not Found!');
            if (booking.status !== booking_status_enum_1.BookingStatus.PENDING) {
                throw new common_1.BadRequestException('Booking already processed');
            }
            const patch = {
                status: booking_status_enum_1.BookingStatus.CONFIRMED,
                paymentStatus: paymentIntentId
                    ? payment_status_enum_1.PaymentStatus.SUCCEEDED
                    : payment_status_enum_1.PaymentStatus.NOT_REQUIRED
            };
            if (paymentIntentId) {
                patch.paymentIntentId = paymentIntentId;
            }
            const updatedBooking = await this.bookingRepo.updateStatus(bookingId, patch, session);
            await session.commitTransaction();
            return updatedBooking;
        }
        catch (error) {
            this.matricsService.incBookingFailed();
            await session.abortTransaction();
            console.log('***********************************');
            console.log(`confirmBookingRequest failed: ${error.message}`, error.stack);
            console.log('***********************************');
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async bookingConfirmed(bookingId, eventId, userId) {
        try {
            console.log('******************************************');
            console.log(`===== INSIDE FINAL BOOKING CONFIRMED =====`);
            console.log('******************************************');
            const booking = await this.bookingRepo.findBookingById(bookingId);
            if (!booking)
                throw new common_1.NotFoundException('Booking Not Found!');
            const user = await this.identityClient.getUserById(booking.userId.toString());
            const event = await this.eventClient.findEventById(booking.eventId.toString());
            await this.notificationOutboxService.addEvent('Booking', bookingId, 'booking.confirmed', {
                bookingId: booking._id.toString(),
                eventName: event?.title ?? 'N/A',
                userName: user?.name ?? 'N/A',
                email: user?.email ?? 'N/A',
            });
            this.eventEmitter.emit('booking.updated', {
                bookingId: bookingId,
                eventId: eventId,
                userId: userId
            });
            this.matricsService.incBookingCreated();
            return true;
        }
        catch (error) {
            console.log('----- Error in booking-Confirmed Service -----');
        }
    }
    async cancelBookingRequest(bookingId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const booking = await this.bookingRepo.findBookingById(bookingId);
            if (!booking)
                throw new common_1.NotFoundException('Booking Not Found!');
            if (booking.status === booking_status_enum_1.BookingStatus.CANCELLED)
                return;
            if (!booking.paymentIntentId) {
                const patch = {
                    status: booking_status_enum_1.BookingStatus.CANCELLED,
                };
                const updatedBooking = await this.bookingRepo.updateStatus(bookingId, patch, session);
                await session.commitTransaction();
                this.eventEmitter.emit('booking.updated', {
                    bookingId: booking._id.toString(),
                    eventId: booking.eventId.toString(),
                    userId: booking.userId.toString()
                });
                return updatedBooking;
            }
            await session.commitTransaction();
            const payload = {
                bookingId: bookingId,
                paymentIntent: booking.paymentIntentId
            };
            await this.emit(domain_events_1.DOMAIN_EVENTS.PAYMENT_REFUND_REQUEST, bookingId, payload);
            return booking;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async cancelConfirmedBooking() {
    }
    async markBookingRefunded(paymentIntentId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const booking = await this.bookingRepo.findBookingByPaymentIntentId(paymentIntentId, session);
            if (!booking)
                return true;
            if (booking.paymentStatus === payment_status_enum_1.PaymentStatus.REFUNDED)
                return true;
            if (booking.status !== booking_status_enum_1.BookingStatus.CONFIRMED)
                return true;
            const patch = {
                status: booking_status_enum_1.BookingStatus.CANCELLED,
                paymentStatus: payment_status_enum_1.PaymentStatus.REFUNDED
            };
            const updatedBooking = await this.bookingRepo.updateStatus(booking._id.toString(), patch, session);
            await session.commitTransaction();
            this.eventEmitter.emit('booking.updated', {
                bookingId: booking._id.toString(),
                eventId: booking.eventId.toString(),
                userId: booking.userId.toString()
            });
            return true;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async bookingFailed(bookingId) {
        const booking = await this.bookingRepo.findBookingById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking Not Found!');
        const patch = {
            status: booking_status_enum_1.BookingStatus.FAILED,
            paymentStatus: payment_status_enum_1.PaymentStatus.NOT_REQUIRED
        };
        await this.bookingRepo.updateStatus(bookingId, patch);
    }
    async getBookingById(id) {
        return await this.bookingRepo.findBookingById(id);
    }
    async findBookingsByEventIdAndPaymentStatus(eventId) {
        return await this.bookingRepo.findBookingsByEventIdAndPaymentStatus(eventId);
    }
    async emit(event, aggregateId, payload) {
        await this.outboxService.addEvent(domain_aggregate_1.AGGREGATES.BOOKING, aggregateId, event, payload);
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_1.Connection,
        booking_repository_1.BookingRepository,
        notification_outbox_service_1.NotificationOutboxService,
        identity_client_1.IdentityClient,
        event_client_1.EventClient,
        redis_service_1.RedisService,
        event_emitter_1.EventEmitter2,
        outbox_service_1.OutboxService,
        logger_service_1.LoggerService,
        metrics_service_1.MetricsService])
], BookingService);
//# sourceMappingURL=booking.service.js.map