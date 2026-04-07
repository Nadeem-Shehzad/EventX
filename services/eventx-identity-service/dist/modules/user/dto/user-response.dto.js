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
exports.UserResponseDTO = exports.ImageResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ImageResponseDTO {
    url;
    publicId;
}
exports.ImageResponseDTO = ImageResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/user/pic.gif' }),
    __metadata("design:type", String)
], ImageResponseDTO.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'user/pic.gif' }),
    __metadata("design:type", String)
], ImageResponseDTO.prototype, "publicId", void 0);
class UserResponseDTO {
    _id;
    name;
    email;
    image;
    role;
    isVerified;
}
exports.UserResponseDTO = UserResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    (0, swagger_1.ApiProperty)({ example: 'skjfhsjhfkajsh12j4' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'kashif' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'kashif@gmail.com' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ImageResponseDTO),
    (0, swagger_1.ApiProperty)({ type: ImageResponseDTO }),
    __metadata("design:type", ImageResponseDTO)
], UserResponseDTO.prototype, "image", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'user' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'false' }),
    __metadata("design:type", Boolean)
], UserResponseDTO.prototype, "isVerified", void 0);
//# sourceMappingURL=user-response.dto.js.map