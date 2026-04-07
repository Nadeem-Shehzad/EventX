"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CircuitBreakerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerService = void 0;
const common_1 = require("@nestjs/common");
const opossum_1 = __importDefault(require("opossum"));
let CircuitBreakerService = CircuitBreakerService_1 = class CircuitBreakerService {
    logger = new common_1.Logger(CircuitBreakerService_1.name);
    create(name, fn) {
        const breaker = new opossum_1.default(fn, {
            timeout: 5000,
            errorThresholdPercentage: 50,
            resetTimeout: 10000,
            volumeThreshold: 5,
            rollingCountTimeout: 30000,
            rollingCountBuckets: 6,
            errorFilter: (error) => error?.response?.status < 500
        });
        breaker.on('open', () => this.logger.warn(`🔴 [${name}] Circuit OPEN`));
        breaker.on('halfOpen', () => this.logger.log(`🟡 [${name}] Circuit HALF-OPEN — testing`));
        breaker.on('close', () => this.logger.log(`🟢 [${name}] Circuit CLOSED — recovered`));
        breaker.on('success', (result) => this.logger.log(`✅ [${name}] success`));
        breaker.on('failure', (error) => this.logger.error(`❌ [${name}] failure: ${error.message}`));
        breaker.on('timeout', () => this.logger.warn(`⏱ [${name}] timeout`));
        breaker.on('reject', () => this.logger.warn(`🚫 [${name}] rejected — circuit is OPEN`));
        breaker.on('fallback', (result) => this.logger.warn(`↩️ [${name}] fallback triggered`));
        return breaker;
    }
};
exports.CircuitBreakerService = CircuitBreakerService;
exports.CircuitBreakerService = CircuitBreakerService = CircuitBreakerService_1 = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerService);
//# sourceMappingURL=circuit-breaker.service.js.map