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
exports.EventsTypesSummaryResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class EventTypesSummaryDTO {
    total;
    eventType;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], EventTypesSummaryDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'public' }),
    __metadata("design:type", String)
], EventTypesSummaryDTO.prototype, "eventType", void 0);
class EventsTypesSummaryResponseDTO {
    success;
    statusCode;
    data;
}
exports.EventsTypesSummaryResponseDTO = EventsTypesSummaryResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EventsTypesSummaryResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], EventsTypesSummaryResponseDTO.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EventTypesSummaryDTO }),
    __metadata("design:type", EventTypesSummaryDTO)
], EventsTypesSummaryResponseDTO.prototype, "data", void 0);
//# sourceMappingURL=event-type-summary-response.dto.js.map