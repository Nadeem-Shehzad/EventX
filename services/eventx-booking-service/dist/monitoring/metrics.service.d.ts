import * as client from 'prom-client';
export declare class MetricsService {
    bookingCreated: client.Counter<string>;
    bookingFailed: client.Counter<string>;
    bookingCancelled: client.Counter<string>;
    constructor();
    incBookingCreated(): void;
    incBookingFailed(): void;
    incBookingCancelled(): void;
}
