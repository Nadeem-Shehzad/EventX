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
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const logger_service_1 = require("./logger.service");
const api_1 = require("@opentelemetry/api");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
let LoggerModule = class LoggerModule {
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.LOG_LEVEL || 'info',
                    base: { service: process.env.SERVICE_NAME },
                    timestamp: () => `,"time":"${new Date().toISOString()}"`,
                    genReqId: (req) => req.headers['x-request-id'] ?? (0, crypto_1.randomUUID)(),
                    autoLogging: {
                        ignore: (req) => req.url === '/v1/metrics',
                    },
                    customProps: (req, res) => {
                        if (!req._traceContext) {
                            const span = api_1.trace.getActiveSpan();
                            if (span?.isRecording()) {
                                const { traceId, spanId } = span.spanContext();
                                req._traceContext = { trace_id: traceId, span_id: spanId };
                            }
                        }
                        return req._traceContext ?? {};
                    },
                    serializers: {
                        req: (req) => ({
                            id: req.id,
                            method: req.method,
                            url: req.url,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                    ...(process.env.DOCKER !== 'true' && {
                        transport: {
                            target: 'pino/file',
                            options: {
                                destination: path_1.default.join(process.cwd(), 'logs', `${process.env.SERVICE_NAME}.log`),
                                mkdir: true,
                            },
                        },
                    }),
                },
            }),
        ],
        providers: [logger_service_1.LoggerService],
        exports: [logger_service_1.LoggerService],
    })
], LoggerModule);
//# sourceMappingURL=logger.module.js.map