"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConfigModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const config_1 = require("@nestjs/config");
let RabbitMQConfigModule = class RabbitMQConfigModule {
};
exports.RabbitMQConfigModule = RabbitMQConfigModule;
exports.RabbitMQConfigModule = RabbitMQConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nestjs_rabbitmq_1.RabbitMQModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('RABBITMQ_URI'),
                    exchanges: [
                        { name: 'eventx.events', type: 'topic' },
                        { name: 'eventx.dlx', type: 'topic' },
                    ],
                    connectionInitOptions: { wait: true },
                    defaultSubscribeErrorBehavior: nestjs_rabbitmq_1.MessageHandlerErrorBehavior.NACK,
                    channels: {
                        'channel-main': {
                            prefetchCount: 1,
                            default: true,
                        },
                    },
                }),
            }),
        ],
        exports: [nestjs_rabbitmq_1.RabbitMQModule],
    })
], RabbitMQConfigModule);
//# sourceMappingURL=rabbitmq-config.module.js.map