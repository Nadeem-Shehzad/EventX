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
exports.publicResponseData = exports.BookingRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_status_enum_1 = require("../enum/booking-status.enum");
const payment_status_enum_1 = require("../../../constants/payment-status.enum");
const db_error_util_1 = require("../../../common/utils/db-error.util");
const base_pipeline_1 = require("../../../common/base/base.pipeline");
let BookingRepository = class BookingRepository extends base_pipeline_1.BasePipeline {
    constructor(bookingModel) {
        super(bookingModel);
        this.bookingModel = bookingModel;
    }
    async createBooking(data, session) {
        const [booking] = await this.bookingModel.create([data], { session });
        return booking;
    }
    async checkBookingExists(userId, eventId, ticketTypeId) {
        try {
            return await this.safeQuery(() => this.bookingModel.findOne({
                userId: new mongoose_2.Types.ObjectId(userId),
                eventId: new mongoose_2.Types.ObjectId(eventId),
                ticketTypeId: new mongoose_2.Types.ObjectId(ticketTypeId),
                status: {
                    $in: [
                        booking_status_enum_1.BookingStatus.PENDING,
                        booking_status_enum_1.BookingStatus.CONFIRMED
                    ]
                }
            }).lean().exec(), { context: 'BookingRepository.checkBookingExists' });
        }
        catch (error) {
            (0, db_error_util_1.throwDbException)(error, 'BookingRepository.checkBookingExists');
        }
    }
    async allBookings(page, limit) {
        const skip = (page - 1) * limit;
        const pipeline = [
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: exports.publicResponseData }
                    ],
                    totalBookings: [
                        { $count: 'count' }
                    ]
                }
            }
        ];
        const result = await this.bookingModel.aggregate(pipeline);
        const bookings = result[0].data ?? [];
        const total = result[0].totalBookings[0]?.count || 0;
        return {
            bookings,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getBookingsByFilter(filter, options) {
        const pipeline = [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: options.skip },
                        { $limit: options.limit },
                        {
                            $project: exports.publicResponseData
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ];
        const result = await this.bookingModel.aggregate(pipeline);
        const bookings = result[0].data.map(b => ({
            ...b,
            userId: b.userId.toString(),
            eventId: b.eventId.toString(),
            ticketTypeId: b.ticketTypeId.toString(),
            _id: b._id.toString()
        }));
        const total = result[0].totalCount[0]?.count || 0;
        return {
            bookings,
            meta: {
                total,
                page: Math.floor(options.skip / options.limit) + 1,
                limit: options.limit,
                totalPages: Math.ceil(total / options.limit)
            }
        };
    }
    async findBookingById(bookingId) {
        try {
            return await this.safeQuery(() => this.bookingModel.findById(bookingId), { context: 'BookingRepository.findBookingById' });
        }
        catch (error) {
            (0, db_error_util_1.throwDbException)(error, 'BookingRepository.findBookingById');
        }
    }
    async findBookingByPaymentIntentId(paymentIntentId, session) {
        const booking = await this.bookingModel.findOne({ paymentIntentId }).session(session);
        return booking;
    }
    async findBookingsByEventIdAndPaymentStatus(eventId) {
        const objId = new mongoose_2.Types.ObjectId(eventId);
        try {
            return await this.safeQuery(() => this.bookingModel.find({
                eventId: objId,
                paymentStatus: payment_status_enum_1.PaymentStatus.SUCCEEDED
            }), { context: 'BookingRepository.findBookingsByEventIdAndPaymentStatus' });
        }
        catch (error) {
            (0, db_error_util_1.throwDbException)(error, 'BookingRepository.findBookingsByEventIdAndPaymentStatus');
        }
    }
    async findBookingsByEventId(eventId, page, limit) {
        const skip = (page - 1) * limit;
        const objId = new mongoose_2.Types.ObjectId(eventId);
        const pipeline = [
            { $match: { eventId: objId } },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: exports.publicResponseData }
                    ],
                    totalCounts: [
                        { $count: 'count' }
                    ]
                }
            }
        ];
        const result = await this.bookingModel.aggregate(pipeline);
        const bookings = result[0].data ?? [];
        const total = result[0].totalCounts[0]?.count || 0;
        return {
            bookings,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findBookingsByUserId(userId, page, limit) {
        const objId = new mongoose_2.Types.ObjectId(userId);
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: { userId: objId } },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: exports.publicResponseData }
                    ],
                    totalCounts: [
                        { $count: 'count' }
                    ]
                }
            }
        ];
        const result = await this.bookingModel.aggregate(pipeline);
        const bookings = result[0].data ?? [];
        const total = result[0].totalCounts[0]?.count || 0;
        return {
            bookings,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async updateStatus(bookingId, update, session) {
        const booking = await this.bookingModel.findOneAndUpdate({ _id: bookingId }, {
            $set: {
                ...update,
                updatedAt: new Date(),
                expiresAt: null
            }
        }, { new: true, session });
        return booking;
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Booking')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookingRepository);
exports.publicResponseData = {
    _id: { $toString: '$_id' },
    userId: 1,
    eventId: 1,
    ticketTypeId: 1,
    quantity: 1,
    status: 1,
    amount: 1,
    currency: 1
};
//# sourceMappingURL=booking.repository.js.map