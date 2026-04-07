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
exports.EventsList = void 0;
const graphql_1 = require("@nestjs/graphql");
const event_type_1 = require("./event.type");
let EventsList = class EventsList {
    data;
    total;
    page;
    limit;
};
exports.EventsList = EventsList;
__decorate([
    (0, graphql_1.Field)(() => [event_type_1.Event]),
    __metadata("design:type", Array)
], EventsList.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EventsList.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EventsList.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EventsList.prototype, "limit", void 0);
exports.EventsList = EventsList = __decorate([
    (0, graphql_1.ObjectType)()
], EventsList);
//# sourceMappingURL=event-list.type.js.map