import { EventService } from "../event.service";
export declare class TicketConsumer {
    private readonly eventService;
    private readonly logger;
    constructor(eventService: EventService);
    handleCompensation(msg: any): Promise<void>;
}
