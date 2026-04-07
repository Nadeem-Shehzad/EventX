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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const ticket_module_1 = require("./modules/ticket/ticket.module");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const redis_config_1 = __importDefault(require("./config/redis.config"));
const service_config_1 = __importDefault(require("./config/service.config"));
const validation_schema_1 = require("./config/validation.schema");
const cors_config_1 = require("./config/cors.config");
const redis_module_1 = require("./redis/redis.module");
const queues_module_1 = require("./queue/queues.module");
const rabbit_config_1 = __importDefault(require("./config/rabbit.config"));
const rabbitmq_module_1 = require("./rabbitmq/rabbitmq.module");
const event_module_1 = require("./modules/event/event.module");
const auth_config_1 = __importDefault(require("./config/auth.config"));
const common_module_1 = require("./common/common.module");
const request_id_middleware_1 = require("./common/logger/middleware/request-id.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [auth_config_1.default, cors_config_1.corsConfig, redis_config_1.default, service_config_1.default, rabbit_config_1.default],
                validationSchema: validation_schema_1.validationSchema,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('CATALOG_MONGO_URI'),
                }),
            }),
            common_module_1.CommonModule,
            rabbitmq_module_1.CustomRabbitMQModule,
            redis_module_1.MyRedisModule,
            queues_module_1.QueuesModule,
            event_module_1.EventModule,
            ticket_module_1.TicketModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map