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
exports.RegisterDTO = exports.ImageDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ImageDTO {
    url;
    publicId;
}
exports.ImageDTO = ImageDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/user/pic.gif' }),
    __metadata("design:type", String)
], ImageDTO.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'user/pic.gif' }),
    __metadata("design:type", String)
], ImageDTO.prototype, "publicId", void 0);
class RegisterDTO {
    name;
    email;
    password;
    image;
    role;
}
exports.RegisterDTO = RegisterDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is Required!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'Name must be at least 3 characters!' }),
    (0, class_validator_1.MaxLength)(22, { message: 'Name must not exceed 22 characters!' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, swagger_1.ApiProperty)({ example: 'Kashif' }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email Required!' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, swagger_1.ApiProperty)({ example: 'kashif@gmail.com' }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password Required!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long!' }),
    (0, class_validator_1.MaxLength)(22, { message: 'Password must not exceed 22 characters!' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' }),
    (0, class_validator_1.Matches)(/[0-9]/, { message: 'Password must contain at least one number.' }),
    (0, class_validator_1.Matches)(/[@$!%*?&]/, { message: 'Password must contain at least one special character.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, swagger_1.ApiProperty)({ example: '$Abc123456' }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return undefined;
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                throw new Error('Invalid JSON format');
            }
        }
        return value;
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ImageDTO),
    (0, swagger_1.ApiProperty)({ type: ImageDTO }),
    __metadata("design:type", ImageDTO)
], RegisterDTO.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, swagger_1.ApiProperty)({ example: 'user' }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "role", void 0);
//# sourceMappingURL=register.dto.js.map