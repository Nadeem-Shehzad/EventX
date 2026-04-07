"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentMetricsService = void 0;
const common_1 = require("@nestjs/common");
const client = __importStar(require("prom-client"));
let PersistentMetricsService = class PersistentMetricsService {
    registry;
    loginTotal;
    loginSuccess;
    loginFailed;
    logoutTotal;
    registerTotal;
    gateway;
    async onModuleInit() {
        this.registry = new client.Registry();
        this.loginTotal = new client.Counter({
            name: 'auth_login_total_persistent',
            help: 'Total login attempts persistent',
            labelNames: ['service'],
            registers: [this.registry],
        });
        this.loginSuccess = new client.Counter({
            name: 'auth_login_success_persistent',
            help: 'Total successful logins persistent',
            labelNames: ['service'],
            registers: [this.registry],
        });
        this.loginFailed = new client.Counter({
            name: 'auth_login_failed_persistent',
            help: 'Total failed logins persistent',
            labelNames: ['service'],
            registers: [this.registry],
        });
        this.logoutTotal = new client.Counter({
            name: 'auth_logout_total_persistent',
            help: 'Total logouts persistent',
            labelNames: ['service'],
            registers: [this.registry],
        });
        this.registerTotal = new client.Counter({
            name: 'auth_register_total_persistent',
            help: 'Total registrations persistent',
            labelNames: ['service'],
            registers: [this.registry],
        });
        this.gateway = new client.Pushgateway('http://localhost:9091', [], this.registry);
    }
    async push() {
        try {
            await this.gateway.pushAdd({
                jobName: 'identity-service',
                groupings: { instance: 'identity-service' },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('Failed to push to Pushgateway:', message);
        }
    }
    async incrementLoginTotal() {
        this.loginTotal.inc({ service: 'identity-service' });
        await this.push();
    }
    async incrementLoginSuccess() {
        this.loginSuccess.inc({ service: 'identity-service' });
        await this.push();
    }
    async incrementLoginFailed() {
        this.loginFailed.inc({ service: 'identity-service' });
        await this.push();
    }
    async incrementLogout() {
        this.logoutTotal.inc({ service: 'identity-service' });
        await this.push();
    }
    async incrementRegister() {
        this.registerTotal.inc({ service: 'identity-service' });
        await this.push();
    }
};
exports.PersistentMetricsService = PersistentMetricsService;
exports.PersistentMetricsService = PersistentMetricsService = __decorate([
    (0, common_1.Injectable)()
], PersistentMetricsService);
//# sourceMappingURL=metrics.service.js.map