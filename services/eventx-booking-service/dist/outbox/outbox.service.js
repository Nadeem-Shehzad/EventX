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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const outbox_repo_1 = require("./outbox.repo");
let OutboxService = class OutboxService {
    constructor(outboxRepo) {
        this.outboxRepo = outboxRepo;
    }
    async addEvent(aggregateType, aggregateId, eventType, payload, session) {
        return this.outboxRepo.addEvent(aggregateType, aggregateId, eventType, payload, session);
    }
    async findPending() {
        return await this.outboxRepo.findPending();
    }
    async markDispatched(id) {
        return await this.outboxRepo.markDispatched(id);
    }
    async markPublished(id) {
        return await this.outboxRepo.markPublished(id);
    }
    getModel() {
        return this.outboxRepo.getModel();
    }
};
exports.OutboxService = OutboxService;
exports.OutboxService = OutboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outbox_repo_1.OutboxRepo])
], OutboxService);
//# sourceMappingURL=outbox.service.js.map