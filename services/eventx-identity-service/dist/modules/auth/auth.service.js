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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const user_response_dto_1 = require("../user/dto/user-response.dto");
const class_transformer_1 = require("class-transformer");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const crypto_1 = require("crypto");
const redis_service_1 = require("../../redis/redis.service");
const auth_helper_1 = require("./helpers/auth.helper");
const logger_service_1 = require("../../common/logger/logger.service");
const metrics_service_1 = require("../../metrics/metrics.service");
const logs_constant_1 = require("../../constants/logs.constant");
const api_1 = require("@opentelemetry/api");
const tracer = api_1.trace.getTracer('identity-service');
let AuthService = AuthService_1 = class AuthService {
    userService;
    jwtService;
    configService;
    mailService;
    redis;
    helper;
    pinoLogger;
    metricsService;
    constructor(userService, jwtService, configService, mailService, redis, helper, pinoLogger, metricsService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.redis = redis;
        this.helper = helper;
        this.pinoLogger = pinoLogger;
        this.metricsService = metricsService;
    }
    logger = new common_1.Logger(AuthService_1.name);
    async register(data) {
        this.metricsService.incrementRegisterAttempts();
        this.pinoLogger.info('Register attempt started');
        const hashedPassword = await this.helper.hashValue(data.password, 'credentials');
        const user = await this.userService.createUser({
            ...data,
            password: hashedPassword,
        });
        if (!user) {
            this.metricsService.incrementRegisterFailed('invalid_credentials');
            this.pinoLogger.error('Register attempt failed', { reason: 'invalid_credentials' });
            throw new common_1.InternalServerErrorException('User creation failed');
        }
        this.pinoLogger.info('Register user ', { userId: user._id.toString() });
        this.metricsService.incrementRegisterSuccess();
        this.sendVerificationEmail(String(user._id), user.email).catch((err) => {
            this.logger.error(`Verification email failed for ${user.email}: ${err.message}`);
            this.pinoLogger.error(`Verification email failed for ${user.email}: ${err.message}`);
        });
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDTO, user.toObject(), {
            excludeExtraneousValues: true,
        });
    }
    async login(loginData) {
        return tracer.startActiveSpan('AuthService.login', async (serviceSpan) => {
            try {
                const start = Date.now();
                this.metricsService.incrementLoginAttempt();
                this.pinoLogger.info('Login attempt started', {
                    email: loginData.email,
                    action: logs_constant_1.ACTION.LOGIN,
                    status: logs_constant_1.STATUS.START,
                    method: logs_constant_1.METHOD.POST,
                });
                const user = await this.userService.getUserByEmailWithPassword(loginData.email);
                if (!user) {
                    this.metricsService.incrementLoginFailed('user_not_found');
                    this.pinoLogger.warn('Login failed - user not found', {});
                    throw new common_1.NotFoundException('User not registered');
                }
                const passwordMatched = await tracer.startActiveSpan('ComparePassword', async (compareSpan) => {
                    const matched = await this.helper.compareValue(loginData.password, user.password, 'password');
                    compareSpan.end();
                    return matched;
                });
                if (!passwordMatched) {
                    this.metricsService.incrementLoginFailed('invalid_credentials');
                    this.pinoLogger.warn('Login failed - invalid password', {});
                    throw new common_1.UnauthorizedException('Invalid password');
                }
                const payload = this.helper.buildPayload(user);
                const accessToken = this.helper.signAccessToken(payload);
                const refreshToken = this.helper.signRefreshToken(payload);
                this.pinoLogger.info('Login credentials verified', { userId: user._id.toString() });
                this.helper.hashValue(refreshToken, 'refresh token')
                    .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
                    .catch((err) => {
                    this.pinoLogger.error('Failed to persist refresh token', {
                        userId: user._id.toString(),
                        error: err.message
                    });
                });
                this.metricsService.incrementLoginSuccess(user._id.toString());
                this.pinoLogger.info('Login successful', {});
                serviceSpan.setStatus({ code: api_1.SpanStatusCode.OK });
                return { accessToken, refreshToken };
            }
            catch (error) {
                const err = error;
                serviceSpan.recordException(err);
                serviceSpan.setStatus({ code: api_1.SpanStatusCode.ERROR, message: err.message });
                throw error;
            }
            finally {
                serviceSpan.end();
            }
        });
    }
    async changePassword(id, cpData) {
        this.pinoLogger.info('changePassword attempt started', { UserId: id.toString() });
        const user = await this.userService.findUserByIDWithPassword(id);
        if (!user) {
            this.pinoLogger.error('User not found', { UserId: id.toString() });
            throw new common_1.NotFoundException('User not found');
        }
        const passwordMatched = await this.helper.compareValue(cpData.currentPassword, user.password, 'current password');
        if (!passwordMatched) {
            this.pinoLogger.error('Invalid current password', { UserId: id.toString() });
            throw new common_1.UnauthorizedException('Invalid current password');
        }
        if (cpData.currentPassword === cpData.newPassword) {
            this.pinoLogger.error('New password must differ from current password', { UserId: id.toString() });
            throw new common_1.BadRequestException('New password must differ from current password');
        }
        if (cpData.newPassword !== cpData.confirmPassword) {
            this.pinoLogger.error('New password and confirm password do not match', { UserId: id.toString() });
            throw new common_1.BadRequestException('New password and confirm password do not match');
        }
        const newHashedPassword = await this.helper.hashValue(cpData.newPassword, 'new password');
        await this.userService.updateUser(user._id, { password: newHashedPassword });
        this.pinoLogger.info('Password changed successfully', { UserId: id.toString() });
        return { message: 'Password changed successfully' };
    }
    async logout(userId) {
        this.pinoLogger.info('logout attempt started', { UserId: userId.toString() });
        await this.userService.removeUserToken(userId);
        this.metricsService.decrementActiveUsers(userId);
        this.pinoLogger.info('logout successfully', { UserId: userId.toString() });
        return { loggedOut: true };
    }
    async refreshToken(userData, rf_Token) {
        this.pinoLogger.info('refreshToken attempt started', { UserId: userData.id.toString() });
        const user = await this.userService.getUserByIdWithRefreshToken(userData.id);
        if (!user) {
            this.pinoLogger.error('User not found', { UserId: userData.id.toString() });
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.refreshToken) {
            this.pinoLogger.error('No active session', { UserId: userData.id.toString() });
            throw new common_1.UnauthorizedException('No active session');
        }
        const isValid = await this.helper.compareValue(rf_Token, user.refreshToken, 'refresh token');
        if (!isValid) {
            this.pinoLogger.warn('Invalid refresh token', { UserId: userData.id.toString() });
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const payload = this.helper.buildPayload(user);
        const accessToken = this.helper.signAccessToken(payload);
        const newRefreshToken = this.helper.signRefreshToken(payload);
        this.pinoLogger.info('new refresh token generated', { rfToken: newRefreshToken });
        this.helper.hashValue(newRefreshToken, 'refresh token')
            .then(hashed => this.userService.updateUser(user._id, { refreshToken: hashed }))
            .catch(err => this.logger.error(`Failed to rotate refresh token for ${user._id}: ${err.message}`));
        return { accessToken, refreshToken: newRefreshToken };
    }
    async sendVerificationEmail(id, email) {
        this.pinoLogger.info('sendVerificationEmail attempt started', { email: email.toString() });
        let token;
        try {
            token = await this.jwtService.signAsync({ id }, { expiresIn: '15m' });
        }
        catch {
            this.pinoLogger.error('Failed to generate verification token', { email: email.toString() });
            throw new common_1.InternalServerErrorException('Failed to generate verification token');
        }
        const APP_URL = this.configService.get('app_url');
        const url = `${APP_URL}/auth/v1/verify-email?token=${token}`;
        try {
            await this.mailService.sendMail({
                to: email,
                subject: 'Verify your email',
                html: `
          <h2>Email verification</h2>
          <p>Click below to verify your email:</p>
          <a href="${url}">${url}</a>
        `,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.pinoLogger.error(`Failed to send verification email`, { email, error: message });
            this.logger.error(`Failed to send verification email to ${email}: ${message}`);
        }
    }
    async verifyEmail(token) {
        this.pinoLogger.info('verifyEmail attempt started');
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        }
        catch (err) {
            this.pinoLogger.error('Token verification failed', { token: token.toString() });
            if (err instanceof jwt_1.TokenExpiredError) {
                throw new common_1.BadRequestException('Verification link has expired');
            }
            if (err instanceof jwt_1.JsonWebTokenError) {
                throw new common_1.BadRequestException('Invalid verification token');
            }
            throw new common_1.InternalServerErrorException('Token verification failed');
        }
        const user = await this.userService.getUserById(payload.id);
        if (!user) {
            this.pinoLogger.error('User not found', { UserId: payload.id.toString() });
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isVerified) {
            this.pinoLogger.warn('Email already verified', { UserId: payload.id.toString() });
            return { message: 'Email already verified' };
        }
        await this.userService.updateUser(user._id, { isVerified: true });
        this.pinoLogger.info('Email verified successfully', { UserId: user._id.toString() });
        return { message: 'Email verified successfully' };
    }
    async forgotPassword(email) {
        this.pinoLogger.info('forgotPassword attempt started');
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            this.pinoLogger.error('User not Found', { email: email.toString() });
            return { message: 'User not Found' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const userId = String(user._id);
        try {
            await this.redis.set(`fp:${token}`, userId, 60 * 15);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.pinoLogger.error(`Redis unavailable for forgot password`, { userId, error: message });
            this.logger.error(`Redis unavailable for forgot password: ${message}`);
            throw new common_1.ServiceUnavailableException('Unable to process request, please try again');
        }
        const APP_URL = this.configService.get('app_url');
        const url = `${APP_URL}/auth/v1/reset-password?token=${token}`;
        this.mailService
            .sendMail({
            to: email,
            subject: 'Reset your password',
            html: `
          <h2>Reset password</h2>
          <p>Click below to reset your password:</p>
          <a href="${url}">${url}</a>
        `,
        })
            .catch(err => this.logger.error(`Failed to send reset email to ${email}: ${err.message}`));
        this.pinoLogger.info('If this email is registered, a reset link has been sent', { email: email.toString() });
        return { message: 'If this email is registered, a reset link has been sent' };
    }
    async resetPassword(dto) {
        this.pinoLogger.info('resetPassword attempt started');
        const { token, newPassword, confirmPassword } = dto;
        if (newPassword !== confirmPassword) {
            this.pinoLogger.warn('Passwords do not match');
            throw new common_1.BadRequestException('Passwords do not match');
        }
        let userId;
        try {
            userId = await this.redis.get(`fp:${token}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.pinoLogger.error(`Redis unavailable for reset password`, { token, error: message });
            this.logger.error(`Redis unavailable for reset password: ${message}`);
            throw new common_1.ServiceUnavailableException('Unable to process request, please try again');
        }
        if (!userId) {
            this.pinoLogger.error(`Invalid or expired token`);
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const user = await this.userService.getUserById(userId);
        if (!user) {
            this.pinoLogger.error(`User not found`);
            throw new common_1.NotFoundException('User not found');
        }
        const hashed = await this.helper.hashValue(newPassword, 'new password');
        await this.userService.updateUser(userId, { password: hashed });
        this.redis.del(`fp:${token}`).catch((err) => {
            this.pinoLogger.error(`Failed to delete reset token from Redis: ${err.message}`);
            this.logger.warn(`Failed to delete reset token from Redis: ${err.message}`);
        });
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mailer_1.MailerService,
        redis_service_1.RedisService,
        auth_helper_1.AuthHelper,
        logger_service_1.LoggerService,
        metrics_service_1.MetricsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map