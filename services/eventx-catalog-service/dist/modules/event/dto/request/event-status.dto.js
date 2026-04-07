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
exports.EventStatusDTO = void 0;
const class_validator_1 = require("class-validator");
const event_enums_1 = require("../../enums/event.enums");
const swagger_1 = require("@nestjs/swagger");
class EventStatusDTO {
    status;
}
exports.EventStatusDTO = EventStatusDTO;
__decorate([
    (0, class_validator_1.IsEnum)(event_enums_1.EventStatus, { message: 'status must be one of draft, published, cancelled, completed' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'status is required' }),
    (0, swagger_1.ApiProperty)({ example: 'published' }),
    __metadata("design:type", String)
], EventStatusDTO.prototype, "status", void 0);
//# sourceMappingURL=event-status.dto.js.map