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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const stripe_constants_1 = require("./stripe.constants");
const stripe_1 = __importDefault(require("stripe"));
const stripe_service_1 = require("./stripe.service");
const config_1 = require("@nestjs/config");
let StripeModule = class StripeModule {
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: stripe_constants_1.STRIPE_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return new stripe_1.default(configService.getOrThrow('stripe.secretKey'), {
                        apiVersion: '2025-02-24.acacia',
                    });
                },
            },
            stripe_service_1.StripeService,
        ],
        exports: [stripe_service_1.StripeService],
    })
], StripeModule);
//# sourceMappingURL=stripe.module.js.map