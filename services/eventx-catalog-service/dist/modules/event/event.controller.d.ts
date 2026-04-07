import { EventService } from "./event.service";
import { CreateEventDTO } from "./dto/request/create-event.dto";
import { EventQueryDTO } from "./dto/request/event-query.dto";
import { EventStatusDTO } from "./dto/request/event-status.dto";
import { EventVisibilityDTO } from "./dto/request/event-visibility.dto";
import { PaginationDTO } from "./dto/request/pagination.dto";
import { UpdateEventDTO } from "./dto/request/update-event.dto";
import { EventResponseDTO } from "./dto/response/event-response.dto";
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    private readonly logger;
    addEvent(organizerId: string, data: CreateEventDTO): Promise<{
        eventId: string;
        message: string;
    }>;
    UploadImage(file?: Express.Multer.File): {
        url: string;
        publicId: string;
    };
    updateEvent(eventId: string, dataToUpdate: UpdateEventDTO): Promise<"Event updated successfully" | "Event not updated">;
    getEvents(pagination: PaginationDTO): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getEventsByFilter(query: EventQueryDTO): Promise<{
        events: any[];
        meta: any;
    }>;
    getFreeEvents(pagination: PaginationDTO): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPaidEvents(pagination: PaginationDTO): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrganizerEvents(id: string, page: number, limit: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrganizerOwnEvents(id: string, page: number, limit: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getEventsByStatus(query: EventStatusDTO, page: number, limit: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    filterEventsByVisibility(query: EventVisibilityDTO, page: number, limit: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    eventsStatusSummary(): Promise<any[]>;
    eventsVisibilitySummary(): Promise<any[]>;
    eventsTypeSummary(): Promise<any[]>;
    eventTagsSummary(): Promise<any[]>;
    upcomingEvents(page: number, limit: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    publishEvent(eventId: string, organizerId: string): Promise<EventResponseDTO>;
    cancelEvent(eventId: string, organizerId: string): Promise<EventResponseDTO>;
    softDeleteEvent(eventId: string, organizerId: string): Promise<{
        message: string;
    }>;
    recoverDeletedEvent(eventId: string, organizerId: string): Promise<EventResponseDTO>;
    deleteEventPermanently(id: string, organizerId: string): Promise<{
        message: string;
    }>;
    getEventsByFilter_Internal(query: EventQueryDTO, apiKey: string): Promise<{
        events: any[];
        meta: any;
    }>;
    getEvent_Internal(id: string, apiKey: string): Promise<import("./schema/event.schema").EventDocument | null>;
}
