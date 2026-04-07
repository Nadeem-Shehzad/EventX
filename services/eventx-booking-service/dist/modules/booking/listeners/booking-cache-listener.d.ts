import { RedisService } from "src/redis/redis.service";
export declare class BookingCacheListener {
    private readonly redis;
    constructor(redis: RedisService);
    handleBookingCreated(payload: {
        bookingId: string;
        eventId: string;
        userId: string;
    }): Promise<void>;
    handleBookingUpdated(payload: {
        bookingId: string;
        eventId: string;
        userId: string;
    }): Promise<void>;
}
