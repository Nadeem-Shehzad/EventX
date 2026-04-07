"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsModule = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
let MetricsModule = class MetricsModule {
};
exports.MetricsModule = MetricsModule;
exports.MetricsModule = MetricsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            metrics_service_1.MetricsService,
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_login_total',
                help: 'Total login attempts',
                labelNames: ['status'],
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_login_success_total',
                help: 'Total successful logins',
                labelNames: ['service', 'userId'],
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_login_failed_total',
                help: 'Total failed logins',
                labelNames: ['service', 'reason'],
            }),
            (0, nestjs_prometheus_1.makeGaugeProvider)({
                name: 'auth_active_users_total',
                help: 'Total currently active users',
                labelNames: ['service'],
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_logout_total',
                help: 'Total logouts',
                labelNames: ['service'],
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_register_total',
                help: 'Total register attempts',
                labelNames: ['status']
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_register_success_total',
                help: 'Total successful register',
                labelNames: ['service']
            }),
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'auth_register_failed_total',
                help: 'Total failed register',
                labelNames: ['service', 'reason']
            }),
            (0, nestjs_prometheus_1.makeHistogramProvider)({
                name: 'auth_login_duration_seconds',
                help: 'How long login takes in seconds',
                labelNames: ['status'],
                buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
            })
        ],
        exports: [
            metrics_service_1.MetricsService,
        ],
    })
], MetricsModule);
//# sourceMappingURL=metrics.module.js.map