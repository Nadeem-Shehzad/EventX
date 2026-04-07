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
exports.UpdateTicketTypeDto = exports.UpdateEventDTO = void 0;
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_event_dto_1 = require("./create-event.dto");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UpdateEventDTO extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_event_dto_1.CreateEventDTO, ['ticketTypes'])) {
    ticketTypes;
}
exports.UpdateEventDTO = UpdateEventDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateTicketTypeDto),
    __metadata("design:type", Array)
], UpdateEventDTO.prototype, "ticketTypes", void 0);
class UpdateTicketTypeDto {
    _id;
    name;
    totalQuantity;
    price;
    isPaidEvent;
    currency;
}
exports.UpdateTicketTypeDto = UpdateTicketTypeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'asjhajhdasjhas857n' }),
    __metadata("design:type", String)
], UpdateTicketTypeDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Kashif' }),
    __metadata("design:type", String)
], UpdateTicketTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], UpdateTicketTypeDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], UpdateTicketTypeDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UpdateTicketTypeDto.prototype, "isPaidEvent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'PKR' }),
    __metadata("design:type", String)
], UpdateTicketTypeDto.prototype, "currency", void 0);
//# sourceMappingURL=update-event.dto.js.map