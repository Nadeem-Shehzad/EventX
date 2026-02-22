"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const config_1 = require("@nestjs/config");
const email_subscriber_1 = require("./email.subscriber");
const mail_module_1 = require("../mail/mail.module");
let EmailQueueModule = class EmailQueueModule {
};
exports.EmailQueueModule = EmailQueueModule;
exports.EmailQueueModule = EmailQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_rabbitmq_1.RabbitMQModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get("RABBITMQ_URI"),
                    exchanges: [
                        {
                            name: "eventx.events",
                            type: "topic",
                        },
                    ],
                    connectionInitOptions: { wait: true },
                    defaultSubscribeErrorBehavior: nestjs_rabbitmq_1.MessageHandlerErrorBehavior.NACK,
                    channels: {
                        'channel-1': {
                            prefetchCount: 1,
                            default: true,
                        },
                    },
                }),
            }),
            mail_module_1.MailModule,
        ],
        providers: [email_subscriber_1.EmailConsumer],
    })
], EmailQueueModule);
//# sourceMappingURL=email.queue.module.js.map