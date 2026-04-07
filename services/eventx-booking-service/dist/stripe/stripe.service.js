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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const stripe_constants_1 = require("./stripe.constants");
const config_1 = require("@nestjs/config");
let StripeService = class StripeService {
    constructor(stripe, configService) {
        this.stripe = stripe;
        this.configService = configService;
    }
    async createPaymentIntent(params, idempotencyKey) {
        return await this.stripe.paymentIntents.create({
            amount: params.amount,
            currency: params.currency,
            payment_method_types: ['card'],
            metadata: params.metadata
        }, idempotencyKey
            ? { idempotencyKey }
            : undefined);
    }
    async confirmTestPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: 'pm_card_visa',
        });
        return paymentIntent;
    }
    async refundPayment(paymentIntentId) {
        return await this.stripe.refunds.create({
            payment_intent: paymentIntentId
        });
    }
    async retrievePaymentIntent(paymentIntentId) {
        return this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(stripe_constants_1.STRIPE_CLIENT)),
    __metadata("design:paramtypes", [stripe_1.default,
        config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map