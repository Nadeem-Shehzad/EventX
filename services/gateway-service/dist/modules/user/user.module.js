"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_resolver_1 = require("./user.resolver");
const user_service_1 = require("./user.service");
const http_service_1 = require("../../common/http/http.service");
const event_module_1 = require("../event/event.module");
const booking_resolver_1 = require("./booking.resolver");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [event_module_1.EventModule],
        providers: [
            user_resolver_1.UserResolver,
            user_service_1.UserService,
            booking_resolver_1.BookingResolver,
            http_service_1.HttpService
        ]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map