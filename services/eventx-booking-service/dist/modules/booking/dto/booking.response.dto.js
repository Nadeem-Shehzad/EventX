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
exports.BookingResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class BookingResponseDTO {
}
exports.BookingResponseDTO = BookingResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    (0, swagger_1.ApiProperty)({ example: 'jsdhfksjfhsdjh123h' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.userId.toString()),
    (0, swagger_1.ApiProperty)({ example: 'jsdhfksjfhsdjh1344' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.eventId.toString()),
    (0, swagger_1.ApiProperty)({ example: 'jsdhfksjfhsdjh12er' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "eventId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.ticketTypeId.toString()),
    (0, swagger_1.ApiProperty)({ example: 'jsdhfksjfhsdjh12er' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "ticketTypeId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], BookingResponseDTO.prototype, "amount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], BookingResponseDTO.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'PENDING' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'PKR' }),
    __metadata("design:type", String)
], BookingResponseDTO.prototype, "currency", void 0);
//# sourceMappingURL=booking.response.dto.js.map