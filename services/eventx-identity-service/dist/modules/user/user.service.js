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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./user.repository");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("./dto/user-response.dto");
const cloudinary_1 = require("cloudinary");
const logger_service_1 = require("../../common/logger/logger.service");
let UserService = UserService_1 = class UserService {
    userRepo;
    pinoLogger;
    constructor(userRepo, pinoLogger) {
        this.userRepo = userRepo;
        this.pinoLogger = pinoLogger;
    }
    logger = new common_1.Logger(UserService_1.name);
    async getUserProfile(id) {
        this.pinoLogger.info('getUserProfile attempt started');
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User not found');
        }
        this.pinoLogger.info('getUserProfile success');
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDTO, user, {
            excludeExtraneousValues: true,
        });
    }
    async getUserDataByID(id) {
        this.pinoLogger.info('getUserDataByID attempt started');
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User not Found!');
        }
        this.pinoLogger.info('getUserDataByID success');
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDTO, user, {
            excludeExtraneousValues: true
        });
    }
    async deleteAccount(id) {
        this.pinoLogger.info('deleteAccount attempt started');
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User Not Found!');
        }
        const imageId = user.image?.publicId;
        const deleted = await this.userRepo.removeAccount(id);
        if (!deleted) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User Not Found!');
        }
        if (imageId) {
            try {
                cloudinary_1.v2.uploader.destroy(imageId)
                    .then(() => this.logger.log(`Cloudinary image deleted: ${imageId}`))
                    .catch((err) => this.logger.error(`Cloudinary delete failed: ${imageId}`, err?.message));
            }
            catch (error) {
                this.pinoLogger.error('Failed to delete image from Cloudinary', { userId: id.toString() });
                this.logger.error(`Failed to delete image from Cloudinary: ${imageId}`, error.stack);
            }
        }
        this.pinoLogger.info('deleteAccount success');
        return { message: 'Account deleted successfully' };
    }
    async updateProfile(id, dataToUpdate) {
        this.pinoLogger.info('updateProfile attempt started');
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User Not Found!');
        }
        if (dataToUpdate.image && user.image?.publicId) {
            cloudinary_1.v2.uploader.destroy(user.image.publicId)
                .catch((err) => {
                this.pinoLogger.error('Cloudinary cleanup failed', { userId: id.toString() });
                this.logger.error(`Cloudinary cleanup failed`, err?.message);
            });
        }
        const result = await this.userRepo.update(id, dataToUpdate);
        if (!result) {
            this.pinoLogger.error('User not found', { userId: id.toString() });
            throw new common_1.NotFoundException('User not found');
        }
        this.pinoLogger.info('deleteAccount success');
        return { message: 'Profile updated successfully' };
    }
    async getAllUsers() {
        this.pinoLogger.info('getAllUsers attempt started');
        const users = await this.userRepo.findAllUsers();
        this.pinoLogger.info('getAllUsers success');
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDTO, users, {
            excludeExtraneousValues: true,
        });
    }
    async createUser(data) {
        return await this.userRepo.create(data);
    }
    async getUserById(id) {
        return await this.userRepo.findUserById(id);
    }
    async findUserByIDWithPassword(id) {
        return await this.userRepo.findByIDWithPassword(id);
    }
    async getUserByEmail(email) {
        return await this.userRepo.findByEmail(email);
    }
    async getUserByEmailWithPassword(email) {
        return await this.userRepo.findByEmailWithPassword(email);
    }
    async getUserByIdWithRefreshToken(id) {
        return await this.userRepo.findByIdWithRefreshToken(id);
    }
    async updateUser(id, dataToUpdate) {
        return await this.userRepo.update(id, dataToUpdate);
    }
    async removeUserToken(id) {
        return await this.userRepo.removeToken(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        logger_service_1.LoggerService])
], UserService);
//# sourceMappingURL=user.service.js.map