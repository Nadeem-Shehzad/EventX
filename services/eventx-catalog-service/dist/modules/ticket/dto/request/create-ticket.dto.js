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
exports.CreateTicketDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class CreateTicketDTO {
    name;
    eventId;
    totalQuantity;
    availableQuantity;
    price;
    isPaidEvent;
    currency;
}
exports.CreateTicketDTO = CreateTicketDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'VIP ticket' }),
    __metadata("design:type", String)
], CreateTicketDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: 'ksdjhfsjdsdjfh64kj5' }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateTicketDTO.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], CreateTicketDTO.prototype, "totalQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], CreateTicketDTO.prototype, "availableQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], CreateTicketDTO.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CreateTicketDTO.prototype, "isPaidEvent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ example: 'PKR' }),
    __metadata("design:type", String)
], CreateTicketDTO.prototype, "currency", void 0);
//# sourceMappingURL=create-ticket.dto.js.map