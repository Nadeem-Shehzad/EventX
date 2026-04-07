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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const user_response_dto_1 = require("./dto/user-response.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const cloudinary_storage_1 = require("../../common/uploads/cloudinary.storage");
const user_roles_1 = require("../../common/decorators/user-roles");
const role_guard_1 = require("../../common/guards/role.guard");
const used_id_1 = require("../../common/decorators/used-id");
const ownership_guard_1 = require("../../common/guards/ownership.guard");
const idempotency_interceptor_1 = require("../../common/interceptors/idempotency.interceptor");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    profile(id) {
        return this.userService.getUserProfile(id);
    }
    updateProfile(id, dataToUpdate, file) {
        if (file) {
            const imageData = {
                url: file.path,
                publicId: file.filename,
            };
            dataToUpdate.image = imageData;
        }
        return this.userService.updateProfile(id, dataToUpdate);
    }
    deleteAccount(id) {
        return this.userService.deleteAccount(id);
    }
    getAllUsers() {
        return this.userService.getAllUsers();
    }
    getUserByID(id) {
        return this.userService.getUserDataByID(id);
    }
    updateUserProfile(id, dataToUpdate) {
        return this.userService.updateProfile(id, dataToUpdate);
    }
    deleteUserAccount(id) {
        return this.userService.deleteAccount(id);
    }
    async getUserInternal(id, apiKey) {
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            throw new common_1.UnauthorizedException('Invalid internal API key');
        }
        return this.userService.getUserDataByID(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: user_response_dto_1.UserResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "profile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.AccountOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Update profile' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'User ID to be updated',
        schema: {
            type: 'string',
            example: '65b12c8a9f4c2e001f3a9d21',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, cloudinary_storage_1.getCloudinaryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard, ownership_guard_1.AccountOwnerShipGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete profile' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'User ID to be deleted',
        schema: {
            type: 'string',
            example: '65b12c8a9f4c2e001f3a9d21',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.Get)(''),
    (0, user_roles_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: [user_response_dto_1.UserResponseDTO]
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by id' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'User ID to be fetched',
        schema: {
            type: 'string',
            example: '65b12c8a9f4c2e001f3a9d21',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: user_response_dto_1.UserResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserByID", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Put)(':id/admin'),
    (0, user_roles_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Admin updates user profile' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'User ID to be updated',
        schema: {
            type: 'string',
            example: '65b12c8a9f4c2e001f3a9d21',
        },
    }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDTO,
        description: 'Fields to update (partial allowed)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Profile updated successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleCheckGuard),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Delete)(':id/admin'),
    (0, user_roles_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'User ID to be deleted',
        schema: {
            type: 'string',
            example: '65b12c8a9f4c2e001f3a9d21',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUserAccount", null);
__decorate([
    (0, common_1.Get)('internal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-internal-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInternal", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)({ path: 'users', version: '1' }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map