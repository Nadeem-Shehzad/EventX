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
exports.CreateEventResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateEventDataDTO {
    eventId;
    message;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '65fae9c1c12a9b0012345678' }),
    __metadata("design:type", String)
], CreateEventDataDTO.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Event Created Successfully' }),
    __metadata("design:type", String)
], CreateEventDataDTO.prototype, "message", void 0);
class CreateEventResponseDTO {
    success;
    statusCode;
    data;
}
exports.CreateEventResponseDTO = CreateEventResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CreateEventResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 201 }),
    __metadata("design:type", Number)
], CreateEventResponseDTO.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateEventDataDTO }),
    __metadata("design:type", CreateEventDataDTO)
], CreateEventResponseDTO.prototype, "data", void 0);
//# sourceMappingURL=create-event-response.dto.js.map