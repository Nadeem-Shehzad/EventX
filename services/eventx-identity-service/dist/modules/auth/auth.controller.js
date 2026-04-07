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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/request/register.dto");
const login_dto_1 = require("./dto/request/login.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const used_id_1 = require("../../common/decorators/used-id");
const ref_token_guard_1 = require("../../common/guards/ref-token.guard");
const change_password_dto_1 = require("./dto/request/change-password.dto");
const user_email_1 = require("../../common/decorators/user-email");
const forgot_password_dto_1 = require("./dto/request/forgot-password.dto");
const reset_password_dto_1 = require("./dto/request/reset-password.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_storage_1 = require("../../common/uploads/cloudinary.storage");
const swagger_1 = require("@nestjs/swagger");
const user_response_dto_1 = require("../user/dto/user-response.dto");
const login_response_dto_1 = require("./swagger/response/login-response.dto");
const forgot_password_response_dto_1 = require("./swagger/response/forgot-password-response.dto");
const idempotency_interceptor_1 = require("../../common/interceptors/idempotency.interceptor");
const api_1 = require("@opentelemetry/api");
const tracer = api_1.trace.getTracer('identity-service');
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(data, file) {
        if (!file)
            throw new common_1.BadRequestException('Image is required');
        const imageData = {
            url: file.path,
            publicId: file.filename
        };
        data.image = imageData;
        return this.authService.register(data);
    }
    login(loginData) {
        return tracer.startActiveSpan('POST /login', async (rootSpan) => {
            try {
                rootSpan.setAttributes({
                    'http.method': 'POST',
                    'route': '/auth/login',
                    'user.email': loginData.email
                });
                const result = await this.authService.login(loginData);
                rootSpan.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                const err = error;
                rootSpan.recordException(err);
                rootSpan.setStatus({ code: api_1.SpanStatusCode.ERROR, message: err.message });
                throw error;
            }
            finally {
                rootSpan.end();
            }
        });
    }
    changePassword(id, cpData) {
        return this.authService.changePassword(id, cpData);
    }
    logout(id) {
        return this.authService.logout(id);
    }
    refreshToken(req) {
        const user = req['user'];
        const rf_Token = req['rf_Token'];
        return this.authService.refreshToken(user, rf_Token);
    }
    sendVerificationEmail(id, email) {
        return this.authService.sendVerificationEmail(id, email);
    }
    verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    forgotPassword(body) {
        return this.authService.forgotPassword(body.email);
    }
    resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered',
        type: user_response_dto_1.UserResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor, (0, platform_express_1.FileInterceptor)('image', {
        storage: (0, cloudinary_storage_1.getCloudinaryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowed.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Only JPEG, PNG, webp images are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User LoggedIn',
        type: login_response_dto_1.LoginResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid credentials' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password Changed Successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid credentials' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'logout' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'LoggedOut.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, used_id_1.GetUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(ref_token_guard_1.JwtRefreshTokenGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send-verification-email'),
    __param(0, (0, used_id_1.GetUserID)()),
    __param(1, (0, user_email_1.GetUserEmail)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendVerificationEmail", null);
__decorate([
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'forgot password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: forgot_password_response_dto_1.ForgotPasswordResponseDTO
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'reset password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully.'
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server Error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)({ path: 'auth', version: '1' }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map