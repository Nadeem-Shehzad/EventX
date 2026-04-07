"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventClientModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_client_1 = require("./event.client");
let EventClientModule = class EventClientModule {
};
exports.EventClientModule = EventClientModule;
exports.EventClientModule = EventClientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    baseURL: config.get('CATALOG_SERVICE_URL'),
                    timeout: 5000
                })
            })
        ],
        providers: [event_client_1.EventClient],
        exports: [event_client_1.EventClient]
    })
], EventClientModule);
//# sourceMappingURL=catalog.module.js.map