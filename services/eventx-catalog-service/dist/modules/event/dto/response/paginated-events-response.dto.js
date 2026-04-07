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
exports.PaginatedEventsResponseDTO = exports.PaginatedMetaDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const event_response_dto_1 = require("./event-response.dto");
class PaginatedMetaDTO {
    page;
    limit;
    total;
    totalPages;
}
exports.PaginatedMetaDTO = PaginatedMetaDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginatedMetaDTO.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginatedMetaDTO.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginatedMetaDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginatedMetaDTO.prototype, "totalPages", void 0);
class PaginatedEventsResponseDTO {
    success;
    statusCode;
    data;
    meta;
}
exports.PaginatedEventsResponseDTO = PaginatedEventsResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PaginatedEventsResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], PaginatedEventsResponseDTO.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [event_response_dto_1.EventResponseDTO] }),
    __metadata("design:type", Array)
], PaginatedEventsResponseDTO.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginatedMetaDTO }),
    __metadata("design:type", PaginatedMetaDTO)
], PaginatedEventsResponseDTO.prototype, "meta", void 0);
//# sourceMappingURL=paginated-events-response.dto.js.map