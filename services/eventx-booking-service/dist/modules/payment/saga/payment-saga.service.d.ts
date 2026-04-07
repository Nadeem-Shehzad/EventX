import { Job } from "bullmq";
import { BookingPaymentHandler } from "./handlers/booking.handler";
export declare class PaymentSagaService {
    private readonly bookingPaymentHandler;
    constructor(bookingPaymentHandler: BookingPaymentHandler);
    handle(job: Job): Promise<void>;
}
