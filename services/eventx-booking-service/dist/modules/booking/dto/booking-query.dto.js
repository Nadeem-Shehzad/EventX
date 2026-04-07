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
exports.BookingQueryDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const booking_status_enum_1 = require("../enum/booking-status.enum");
const swagger_1 = require("@nestjs/swagger");
class BookingQueryDTO {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.BookingQueryDTO = BookingQueryDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: 'skjfhsjfhsdkfh76hds' }),
    __metadata("design:type", String)
], BookingQueryDTO.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: 'skjfhsjfhsdkfh76h23' }),
    __metadata("design:type", String)
], BookingQueryDTO.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(booking_status_enum_1.BookingStatus),
    (0, swagger_1.ApiProperty)({ example: 'PENDING' }),
    __metadata("design:type", String)
], BookingQueryDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z' }),
    __metadata("design:type", Date)
], BookingQueryDTO.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z' }),
    __metadata("design:type", Date)
], BookingQueryDTO.prototype, "dateTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], BookingQueryDTO.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], BookingQueryDTO.prototype, "limit", void 0);
//# sourceMappingURL=booking-query.dto.js.map