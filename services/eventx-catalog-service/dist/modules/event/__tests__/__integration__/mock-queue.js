"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockQueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
let MockQueueModule = class MockQueueModule {
};
exports.MockQueueModule = MockQueueModule;
exports.MockQueueModule = MockQueueModule = __decorate([
    (0, common_1.Module)({
        providers: [{
                provide: (0, bullmq_1.getQueueToken)('event-image-queue'),
                useValue: {
                    add: jest.fn(),
                    process: jest.fn(),
                    close: jest.fn(),
                },
            }],
        exports: [(0, bullmq_1.getQueueToken)('event-image-queue')],
    })
], MockQueueModule);
//# sourceMappingURL=mock-queue.js.map