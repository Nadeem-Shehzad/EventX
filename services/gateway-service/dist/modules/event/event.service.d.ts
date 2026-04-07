import { HttpService } from '../../common/http/http.service';
import { EventFilterInput } from './dto/event-filter.type.dto';
export declare class EventService {
    private http;
    constructor(http: HttpService);
    getEvent(id: string): Promise<any>;
    getOrganizer(organizerId: string): Promise<any>;
    getTickets(eventId: string): Promise<any>;
    getEvents(filter: EventFilterInput, page?: number, limit?: number): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
    }>;
}
