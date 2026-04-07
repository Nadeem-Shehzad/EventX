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
const config_1 = require("@nestjs/config");
const validation_schema_1 = require("./config/validation.schema");
const mongoose_1 = require("@nestjs/mongoose");
const auth_config_1 = __importDefault(require("./config/auth.config"));
const cloudinary_config_1 = __importDefault(require("./config/cloudinary.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const service_config_1 = __importDefault(require("./config/service.config"));
const common_module_1 = require("./common/common.module");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const metrics_module_1 = require("./metrics/metrics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_prometheus_1.PrometheusModule.register({
                path: '/metrics',
                defaultMetrics: {
                    enabled: true
                },
                global: true
            }),
            metrics_module_1.MetricsModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [auth_config_1.default, cloudinary_config_1.default, redis_config_1.default, service_config_1.default],
                validationSchema: validation_schema_1.validationSchema,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('IDENTITY_MONGO_URI'),
                }),
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map