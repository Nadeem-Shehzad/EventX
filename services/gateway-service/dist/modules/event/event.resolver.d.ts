import { Event } from "./dto/event.type";
import { EventService } from "./event.service";
import { EventFilterInput } from "./dto/event-filter.type.dto";
export declare class EventResolver {
    private eventService;
    constructor(eventService: EventService);
    event(id: string): Promise<any>;
    tickets(event: Event): Promise<any>;
    organizer(event: Event): Promise<any>;
    events(filter?: EventFilterInput, page?: number, limit?: number): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
    }>;
}
