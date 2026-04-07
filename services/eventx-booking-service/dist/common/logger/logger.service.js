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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const pino_1 = __importDefault(require("pino"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const request_context_service_1 = require("./request-context.service");
let LoggerService = class LoggerService {
    constructor(context) {
        this.context = context;
        const isDocker = process.env.DOCKER === 'true';
        let transport = undefined;
        if (!isDocker) {
            const logDir = path_1.default.join(process.cwd(), 'logs');
            if (!fs_1.default.existsSync(logDir)) {
                fs_1.default.mkdirSync(logDir);
            }
            const logPath = path_1.default.join(logDir, `${process.env.SERVICE_NAME}.log`);
            transport = pino_1.default.destination({
                dest: logPath,
                sync: false,
            });
        }
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL || 'info',
            base: {
                service: process.env.SERVICE_NAME,
            },
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            mixin: () => ({
                requestId: this.context.getRequestId(),
            }),
        }, transport);
    }
    info(message, data) {
        this.logger.info(data || {}, message);
    }
    error(message, data) {
        this.logger.error(data || {}, message);
    }
    warn(message, data) {
        this.logger.warn(data || {}, message);
    }
    debug(message, data) {
        this.logger.debug(data || {}, message);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map