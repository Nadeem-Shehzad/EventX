"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const queues_1 = require("../constants/queues");
const email_processor_1 = require("./email.processor");
const config_1 = require("@nestjs/config");
const mail_module_1 = require("../mail/mail.module");
let EmailQueueModule = class EmailQueueModule {
};
exports.EmailQueueModule = EmailQueueModule;
exports.EmailQueueModule = EmailQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    connection: {
                        host: config.get('REDIS_HOST'),
                        port: config.get('REDIS_PORT'),
                    },
                }),
            }),
            bullmq_1.BullModule.registerQueue({
                name: queues_1.QUEUES.EMAIL,
                defaultJobOptions: {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 5000 },
                },
            }),
            mail_module_1.MailModule
        ],
        providers: [email_processor_1.EmailProcessor]
    })
], EmailQueueModule);
//# sourceMappingURL=email.queue.module.js.map