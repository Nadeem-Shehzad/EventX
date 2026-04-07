"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingJob = exports.EmailJob = void 0;
var EmailJob;
(function (EmailJob) {
    EmailJob["BOOKING_SUCCESS"] = "booking-success";
    EmailJob["BOOKING_FAILED"] = "booking-failed";
    EmailJob["BOOKING_CANCEL"] = "booking-cancel";
})(EmailJob || (exports.EmailJob = EmailJob = {}));
var BookingJob;
(function (BookingJob) {
    BookingJob["BOOKING_CREATED"] = "booking-created";
    BookingJob["BOOKING_FAILED"] = "booking-failed";
    BookingJob["BOOKING_CANCEL"] = "booking-cancel";
})(BookingJob || (exports.BookingJob = BookingJob = {}));
//# sourceMappingURL=email-queue.constants.js.map