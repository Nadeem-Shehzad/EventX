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
var EventClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let EventClient = EventClient_1 = class EventClient {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(EventClient_1.name);
    }
    async findEventById(eventId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`/events/internal/${eventId}`, {
                headers: {
                    'x-internal-api-key': process.env.INTERNAL_API_KEY
                }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch event ${eventId}: ${error.message}`);
            return null;
        }
    }
};
exports.EventClient = EventClient;
exports.EventClient = EventClient = EventClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], EventClient);
//# sourceMappingURL=event.client.js.map