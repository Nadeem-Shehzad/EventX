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
const core_1 = require("@nestjs/core");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const auth_config_1 = __importDefault(require("./config/auth.config"));
const cloudinary_config_1 = __importDefault(require("./config/cloudinary.config"));
const stripe_config_1 = __importDefault(require("./config/stripe.config"));
const service_config_1 = __importDefault(require("./config/service.config"));
const validation_schema_1 = require("./config/validation.schema");
const common_module_1 = require("./common/common.module");
const redis_module_1 = require("./redis/redis.module");
const redis_config_1 = __importDefault(require("./config/redis.config"));
const rate_limit_module_1 = require("./rateLimit/rate-limit.module");
const queues_module_1 = require("./queue/queues.module");
const db_timeout_constants_1 = require("./constants/db-timeout.constants");
const booking_module_1 = require("./modules/booking/booking.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const payment_module_1 = require("./modules/payment/payment.module");
const schedule_1 = require("@nestjs/schedule");
const logging_module_1 = require("./logging/logging.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const rabbitmq_config_module_1 = require("./rabbitmq/rabbitmq-config.module");
const request_id_middleware_1 = require("./common/logger/middleware/request-id.middleware");
const isProd = process.env.NODE_ENV === 'production';
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
                load: [
                    app_config_1.default,
                    auth_config_1.default,
                    database_config_1.default,
                    redis_config_1.default,
                    cloudinary_config_1.default,
                    stripe_config_1.default,
                    service_config_1.default
                ],
                validationSchema: validation_schema_1.validationSchema
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('BOOKING_MONGO_URI'),
                    serverSelectionTimeoutMS: 30000,
                    socketTimeoutMS: db_timeout_constants_1.DB_QUERY_TIMEOUTS.defaultSocketTimeoutMS,
                    connectTimeoutMS: 20000,
                })
            }),
            common_module_1.CommonModule,
            rabbitmq_config_module_1.RabbitMQConfigModule,
            logging_module_1.LoggingModule,
            monitoring_module_1.MonitoringModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            queues_module_1.QueuesModule,
            schedule_1.ScheduleModule.forRoot(),
            redis_module_1.MyRedisModule,
            rate_limit_module_1.RateLimitModule,
            payment_module_1.PaymentModule,
            booking_module_1.BookingModule
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor
            }
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map