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
exports.CreateBookingResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaymentData {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pi_fdkjh435jhkasjh' }),
    __metadata("design:type", String)
], PaymentData.prototype, "paymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sec_fdkjh435fkjsdh' }),
    __metadata("design:type", Object)
], PaymentData.prototype, "clientSecret", void 0);
class CreateBookingResponseDTO {
}
exports.CreateBookingResponseDTO = CreateBookingResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sdjfhskdjfhskdjfh765' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sdjfhskdjfhskdjfhasf' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sdjfhskdjfhskdjasdas' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sdjfhskdjfhskdjet567' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "ticketTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], CreateBookingResponseDTO.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], CreateBookingResponseDTO.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PKR' }),
    __metadata("design:type", String)
], CreateBookingResponseDTO.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '' }),
    __metadata("design:type", Date)
], CreateBookingResponseDTO.prototype, "confirmedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaymentData }),
    __metadata("design:type", PaymentData)
], CreateBookingResponseDTO.prototype, "payment", void 0);
//# sourceMappingURL=create-booking-response.dto.js.map