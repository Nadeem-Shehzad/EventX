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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const base_pipeline_1 = require("../../common/base/base.pipeline");
const db_error_util_1 = require("../../common/utils/db-error.util");
const metrics_service_1 = require("../../metrics/metrics.service");
let UserRepository = class UserRepository extends base_pipeline_1.BaseRepository {
    userModel;
    metricsService;
    constructor(userModel, metricsService) {
        super(userModel);
        this.userModel = userModel;
        this.metricsService = metricsService;
    }
    async create(data) {
        try {
            return await this.safeQuery(() => this.userModel.create(data), { retry: false, context: 'UserRepository.create' });
        }
        catch (err) {
            this.metricsService.incrementRegisterFailed('db_down');
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.create');
        }
    }
    async update(id, data) {
        try {
            return await this.safeQuery(() => this.userModel
                .findOneAndUpdate({ _id: id }, data, { new: true })
                .exec(), { retry: false, context: 'UserRepository.update' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.update');
        }
    }
    async removeAccount(id) {
        try {
            const result = await this.safeQuery(() => this.userModel.deleteOne({ _id: id }).exec(), { retry: false, context: 'UserRepository.removeAccount' });
            return result.deletedCount > 0;
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.removeAccount');
        }
    }
    async removeToken(id) {
        try {
            return await this.safeQuery(() => this.userModel
                .findOneAndUpdate({ _id: id }, { refreshToken: null }, { new: true })
                .exec(), { retry: false, context: 'UserRepository.removeToken' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.removeToken');
        }
    }
    async findUserById(id) {
        try {
            return await this.safeQuery(() => this.userModel.findById(id).exec(), { context: 'UserRepository.findUserById' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findUserById');
        }
    }
    async findByEmail(email) {
        try {
            return await this.safeQuery(() => this.userModel.findOne({ email }).exec(), { context: 'UserRepository.findByEmail' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findByEmail');
        }
    }
    async findAllUsers() {
        try {
            return await this.safeQuery(() => this.userModel.find().exec(), {
                fallback: [],
                context: 'UserRepository.findAllUsers'
            });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findAllUsers');
        }
    }
    async findByEmailWithPassword(email) {
        try {
            return await this.safeQuery(() => this.userModel.findOne({ email }).select('+password').exec(), { context: 'UserRepository.findByEmailWithPassword' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findByEmailWithPassword');
        }
    }
    async findByIDWithPassword(id) {
        try {
            return await this.safeQuery(() => this.userModel.findById(id).select('+password').exec(), { context: 'UserRepository.findByIDWithPassword' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findByIDWithPassword');
        }
    }
    async findByIdWithRefreshToken(id) {
        try {
            return await this.safeQuery(() => this.userModel.findById(id).select('+refreshToken').exec(), { context: 'UserRepository.findByIdWithRefreshToken' });
        }
        catch (err) {
            (0, db_error_util_1.throwDbException)(err, 'UserRepository.findByIdWithRefreshToken');
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        metrics_service_1.MetricsService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map