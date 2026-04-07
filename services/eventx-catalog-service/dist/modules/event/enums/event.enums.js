"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.EventVisibility = exports.EventStatus = void 0;
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "draft";
    EventStatus["PUBLISHED"] = "published";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["COMPLETED"] = "completed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "public";
    EventVisibility["PRIVATE"] = "private";
})(EventVisibility || (exports.EventVisibility = EventVisibility = {}));
var EventType;
(function (EventType) {
    EventType["ONLINE"] = "online";
    EventType["OFFLINE"] = "offline";
    EventType["HYBRID"] = "hybrid";
})(EventType || (exports.EventType = EventType = {}));
//# sourceMappingURL=event.enums.js.map