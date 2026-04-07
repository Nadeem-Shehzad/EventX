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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const prom_client_1 = require("prom-client");
let MetricsService = class MetricsService {
    loginTotal;
    loginSuccess;
    loginFailed;
    activeUsers;
    logoutUsers;
    registerTotal;
    registerSuccess;
    registerFailed;
    loginDuration;
    activeUserIds = new Set();
    constructor(loginTotal, loginSuccess, loginFailed, activeUsers, logoutUsers, registerTotal, registerSuccess, registerFailed, loginDuration) {
        this.loginTotal = loginTotal;
        this.loginSuccess = loginSuccess;
        this.loginFailed = loginFailed;
        this.activeUsers = activeUsers;
        this.logoutUsers = logoutUsers;
        this.registerTotal = registerTotal;
        this.registerSuccess = registerSuccess;
        this.registerFailed = registerFailed;
        this.loginDuration = loginDuration;
    }
    incrementLoginAttempt() {
        this.loginTotal.inc({ status: 'attempt' });
    }
    incrementLoginSuccess(userId) {
        this.loginSuccess.inc({
            service: 'identity-service',
            userId,
        });
        if (!this.activeUserIds.has(userId)) {
            this.activeUserIds.add(userId);
            this.activeUsers.inc({ service: 'identity-service' });
        }
    }
    incrementLoginFailed(reason) {
        this.loginFailed.inc({
            service: 'identity-service',
            reason,
        });
    }
    decrementActiveUsers(userId) {
        if (this.activeUserIds.has(userId)) {
            this.activeUserIds.delete(userId);
            this.logoutUsers.inc({ service: 'identity-service' });
            this.activeUsers.dec({ service: 'identity-service' });
        }
    }
    incrementRegisterAttempts() {
        this.registerTotal.inc({ status: 'attempt' });
    }
    incrementRegisterSuccess() {
        this.registerSuccess.inc({
            service: 'identity-service'
        });
    }
    incrementRegisterFailed(reason) {
        this.registerFailed.inc({
            service: 'identity-service',
            reason,
        });
    }
    async incrementLoginDuration(status, durationMs) {
        this.loginDuration.observe({ status }, durationMs / 1000);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_prometheus_1.InjectMetric)('auth_login_total')),
    __param(1, (0, nestjs_prometheus_1.InjectMetric)('auth_login_success_total')),
    __param(2, (0, nestjs_prometheus_1.InjectMetric)('auth_login_failed_total')),
    __param(3, (0, nestjs_prometheus_1.InjectMetric)('auth_active_users_total')),
    __param(4, (0, nestjs_prometheus_1.InjectMetric)('auth_logout_total')),
    __param(5, (0, nestjs_prometheus_1.InjectMetric)('auth_register_total')),
    __param(6, (0, nestjs_prometheus_1.InjectMetric)('auth_register_success_total')),
    __param(7, (0, nestjs_prometheus_1.InjectMetric)('auth_register_failed_total')),
    __param(8, (0, nestjs_prometheus_1.InjectMetric)('auth_login_duration_seconds')),
    __metadata("design:paramtypes", [prom_client_1.Counter,
        prom_client_1.Counter,
        prom_client_1.Counter,
        prom_client_1.Gauge,
        prom_client_1.Counter,
        prom_client_1.Counter,
        prom_client_1.Counter,
        prom_client_1.Counter,
        prom_client_1.Histogram])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map