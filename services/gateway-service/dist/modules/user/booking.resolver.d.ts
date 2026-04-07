import { UserBooking } from './dto/booking.type';
import { EventService } from '../event/event.service';
export declare class BookingResolver {
    private eventService;
    constructor(eventService: EventService);
    event(booking: UserBooking): Promise<any>;
}
