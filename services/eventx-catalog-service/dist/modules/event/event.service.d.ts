import { Connection } from 'mongoose';
import { Queue } from 'bullmq';
import { EventRepository } from './event.repository';
import { RedisService } from 'src/redis/redis.service';
import { TicketService } from '../ticket/ticket.service';
import { EventOutboxService } from './outbox/event-outbox.service';
import { CreateEventDTO } from './dto/request/create-event.dto';
import { UpdateEventDTO } from './dto/request/update-event.dto';
import { EventQueryDTO } from './dto/request/event-query.dto';
import { EventResponseDTO } from './dto/response/event-response.dto';
import { LoggerService } from '../../common/logger/logger.service';
export declare class EventService {
    private readonly connection;
    private readonly eventRepo;
    private readonly redis;
    private readonly imageQueue;
    private readonly ticketService;
    private readonly eventOutboxService;
    private readonly pinoLogger;
    private readonly logger;
    constructor(connection: Connection, eventRepo: EventRepository, redis: RedisService, imageQueue: Queue, ticketService: TicketService, eventOutboxService: EventOutboxService, pinoLogger: LoggerService);
    createEvent(organizerId: string, dto: CreateEventDTO): Promise<{
        eventId: string;
        message: string;
    }>;
    updateEvent(eventId: string, dataToUpdate: UpdateEventDTO): Promise<"Event updated successfully" | "Event not updated">;
    getAllEventsByAggregate(page?: number, limit?: number): Promise<{
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
    getFreeEvents(page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPaidEvents(page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUpcomingEvents(page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrganizerEvents(id: string, page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrganizerOwnEvents(id: string, page?: number, limit?: number): Promise<{
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
    deleteEventPermanently(eventId: string, organizerId: string): Promise<{
        message: string;
    }>;
    filterEventsByStatus(status: string, page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    filterEventsByVisibility(visibility: string, page?: number, limit?: number): Promise<{
        events: EventResponseDTO[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    eventStatusSummary(): Promise<any[]>;
    eventVisibilitySummary(): Promise<any[]>;
    eventTypeSummary(): Promise<any[]>;
    eventTagsSummary(): Promise<any[]>;
    findById(id: string): Promise<import("./schema/event.schema").EventDocument | null>;
    findEventOwner(id: string): Promise<{
        organizerId: string;
    } | null>;
    deleteEventById(eventId: string): Promise<import("./schema/event.schema").EventDocument>;
}
