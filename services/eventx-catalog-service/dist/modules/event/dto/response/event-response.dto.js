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
exports.EventResponseDTO = exports.BannerImageResponseDTO = exports.LocationResponseDTO = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class LocationResponseDTO {
    venueName;
    address;
    city;
    country;
    latitude;
    longitude;
}
exports.LocationResponseDTO = LocationResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Expo Center' }),
    __metadata("design:type", String)
], LocationResponseDTO.prototype, "venueName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Wapda Town' }),
    __metadata("design:type", String)
], LocationResponseDTO.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Lahore' }),
    __metadata("design:type", String)
], LocationResponseDTO.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Pakistan' }),
    __metadata("design:type", String)
], LocationResponseDTO.prototype, "country", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 123.456 }),
    __metadata("design:type", Number)
], LocationResponseDTO.prototype, "latitude", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 146.321 }),
    __metadata("design:type", Number)
], LocationResponseDTO.prototype, "longitude", void 0);
class BannerImageResponseDTO {
    url;
    publicId;
}
exports.BannerImageResponseDTO = BannerImageResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/eventx.gif' }),
    __metadata("design:type", String)
], BannerImageResponseDTO.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'eventx/123456' }),
    __metadata("design:type", String)
], BannerImageResponseDTO.prototype, "publicId", void 0);
class EventResponseDTO {
    _id;
    title;
    description;
    category;
    tags;
    eventType;
    location;
    bannerImage;
    startDateTime;
    endDateTime;
    timezone;
    capacity;
    registeredCount;
    isPaid;
    ticketTypes;
}
exports.EventResponseDTO = EventResponseDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    (0, swagger_1.ApiProperty)({ example: 'asjdalskdjalsdk9687' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Mega event launch' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'In expo center lahore there is an event.' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'tech' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "category", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: ['tech', 'expo'] }),
    __metadata("design:type", Array)
], EventResponseDTO.prototype, "tags", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Offline' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "eventType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => {
        if (obj.eventType === 'offline' || obj.eventType === 'hybrid') {
            return obj.location;
        }
        return undefined;
    }),
    (0, swagger_1.ApiProperty)({ type: LocationResponseDTO }),
    __metadata("design:type", LocationResponseDTO)
], EventResponseDTO.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => BannerImageResponseDTO),
    (0, swagger_1.ApiProperty)({ type: BannerImageResponseDTO }),
    __metadata("design:type", BannerImageResponseDTO)
], EventResponseDTO.prototype, "bannerImage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z' }),
    __metadata("design:type", Date)
], EventResponseDTO.prototype, "startDateTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z' }),
    __metadata("design:type", Date)
], EventResponseDTO.prototype, "endDateTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Karachi/Asia' }),
    __metadata("design:type", String)
], EventResponseDTO.prototype, "timezone", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], EventResponseDTO.prototype, "capacity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 20 }),
    __metadata("design:type", Number)
], EventResponseDTO.prototype, "registeredCount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EventResponseDTO.prototype, "isPaid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], EventResponseDTO.prototype, "ticketTypes", void 0);
//# sourceMappingURL=event-response.dto.js.map