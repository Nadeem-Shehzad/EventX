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
exports.CreateEventDTO = exports.ToLowerCase = exports.TicketTypeDto = exports.BannerImageDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const event_enums_1 = require("../../enums/event.enums");
const location_dto_1 = require("../location.dto");
const swagger_1 = require("@nestjs/swagger");
class BannerImageDTO {
    url;
    publicId;
}
exports.BannerImageDTO = BannerImageDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.eventx.com/banner.jpg', description: 'Banner image URL' }),
    __metadata("design:type", String)
], BannerImageDTO.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'banner123', description: 'Banner public ID' }),
    __metadata("design:type", String)
], BannerImageDTO.prototype, "publicId", void 0);
class TicketTypeDto {
    name;
    totalQuantity;
    price;
    isPaidEvent;
    currency;
}
exports.TicketTypeDto = TicketTypeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'VIP Ticket', description: 'Ticket name' }),
    __metadata("design:type", String)
], TicketTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Ticket quantity' }),
    __metadata("design:type", Number)
], TicketTypeDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ example: 500, description: 'Ticket price' }),
    __metadata("design:type", Number)
], TicketTypeDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: true, description: 'check ticket is paid or free' }),
    __metadata("design:type", Boolean)
], TicketTypeDto.prototype, "isPaidEvent", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'PKR', description: 'Ticket price currency' }),
    __metadata("design:type", String)
], TicketTypeDto.prototype, "currency", void 0);
const ToLowerCase = () => (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));
exports.ToLowerCase = ToLowerCase;
class CreateEventDTO {
    title;
    slug;
    description;
    category;
    tags;
    eventType;
    bannerImage;
    startDateTime;
    endDateTime;
    timezone;
    location;
    status;
    visibility;
    capacity;
    registrationDeadline;
    isPaid;
    ticketTypes;
}
exports.CreateEventDTO = CreateEventDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, swagger_1.ApiProperty)({ example: 'T20 World Cup', description: 'Event title' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, exports.ToLowerCase)(),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(15),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, swagger_1.ApiProperty)({ example: 'Mega cricket event with teams', description: 'Event description' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, exports.ToLowerCase)(),
    (0, swagger_1.ApiProperty)({ example: 'sports', description: 'Event Category' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return [];
        if (typeof value === 'string') {
            try {
                return JSON.parse(value.toLowerCase());
            }
            catch {
                throw new Error('Tags must be a valid JSON array');
            }
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, swagger_1.ApiProperty)({ type: [String], example: ['cricket', 'footbal'], description: 'Event Tags' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(event_enums_1.EventType),
    (0, swagger_1.ApiProperty)({ enum: event_enums_1.EventType, example: event_enums_1.EventType.OFFLINE, description: 'Event Type' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "eventType", void 0);
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
    (0, class_transformer_1.Type)(() => BannerImageDTO),
    (0, swagger_1.ApiProperty)({ type: BannerImageDTO, description: 'Banner Image', required: false }),
    __metadata("design:type", BannerImageDTO)
], CreateEventDTO.prototype, "bannerImage", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z', description: 'Event Start Date' }),
    __metadata("design:type", Date)
], CreateEventDTO.prototype, "startDateTime", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z', description: 'Event Start Date' }),
    __metadata("design:type", Date)
], CreateEventDTO.prototype, "endDateTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'Asia/Karachi', description: 'Timezone of the event' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "timezone", void 0);
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
    (0, class_transformer_1.Type)(() => location_dto_1.LocationDTO),
    (0, swagger_1.ApiProperty)({ type: location_dto_1.LocationDTO, description: 'Event Location', required: false }),
    __metadata("design:type", location_dto_1.LocationDTO)
], CreateEventDTO.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(event_enums_1.EventStatus),
    (0, swagger_1.ApiProperty)({ enum: event_enums_1.EventStatus, example: event_enums_1.EventStatus.DRAFT, description: 'Event Status' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(event_enums_1.EventVisibility),
    (0, swagger_1.ApiProperty)({ enum: event_enums_1.EventVisibility, example: event_enums_1.EventVisibility.PUBLIC, description: 'Event Visibility' }),
    __metadata("design:type", String)
], CreateEventDTO.prototype, "visibility", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Event Capacity' }),
    __metadata("design:type", Number)
], CreateEventDTO.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({ example: '2026-03-10T18:00:00Z', description: 'Event registration deadline', required: false }),
    __metadata("design:type", Date)
], CreateEventDTO.prototype, "registrationDeadline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the event is paid', required: false }),
    __metadata("design:type", Boolean)
], CreateEventDTO.prototype, "isPaid", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TicketTypeDto),
    (0, swagger_1.ApiProperty)({ type: [TicketTypeDto], description: 'List of ticket types for the event' }),
    __metadata("design:type", Array)
], CreateEventDTO.prototype, "ticketTypes", void 0);
//# sourceMappingURL=create-event.dto.js.map