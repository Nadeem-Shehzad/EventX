import { ClientSession, Model } from 'mongoose';
import { EventDocument } from './schema/event.schema';
import { UpdateEventDTO } from './dto/request/update-event.dto';
import { CreateEventDTO } from './dto/request/create-event.dto';
import { BasePipeline } from 'src/common/base/base.pipeline';
export declare class EventRepository extends BasePipeline<EventDocument> {
    private readonly eventModel;
    constructor(eventModel: Model<EventDocument>);
    create(data: any, session: ClientSession): Promise<EventDocument>;
    updateEvent(id: string, dataToUpdate: UpdateEventDTO, session: ClientSession): Promise<EventDocument | null>;
    deleteEventPermanently(eventId: string, organizerId: string, session: ClientSession): Promise<EventDocument | null>;
    checkEventExist(organizerId: string, data: CreateEventDTO): Promise<EventDocument | null>;
    findEventById(id: string): Promise<EventDocument | null>;
    publishEvent(eventId: string, organizerId: string): Promise<EventDocument | null>;
    cancelEvent(eventId: string, organizerId: string): Promise<EventDocument | null>;
    softDeleteEvent(eventId: string, organizerId: string): Promise<EventDocument | null>;
    recoverDeletedEvent(eventId: string, organizerId: string): Promise<EventDocument | null>;
    deleteEventHard(eventId: string): Promise<EventDocument | null>;
    getEventsByAggregation(page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    getEventsByFilter(filters: any, options: {
        limit: number;
        skip: number;
    }): Promise<{
        events: any[];
        meta: any;
    }>;
    getFreeEvents(page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    getPaidEvents(page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    getUpcomingEvents(page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    getOrganizerEvents(id: string, page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    getOrganizerOwnEvents(id: string, page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    filterEventsByStatus(status: string, page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    filterEventsByVisibility(visibility: string, page?: number, limit?: number): Promise<{
        events: any[];
        total: number;
    }>;
    eventStatusSummary(): Promise<any[]>;
    eventVisibilitySummary(): Promise<any[]>;
    eventTypeSummary(): Promise<any[]>;
    eventTagsSummary(): Promise<any[]>;
    findEventOwner(eventId: string): Promise<{
        organizerId: string;
    } | null>;
    private runPagedAggregation;
    private runSummaryAggregation;
}
export declare const publicResponseData: {
    _id: {
        $toString: string;
    };
    title: number;
    description: number;
    category: number;
    tags: number;
    eventType: number;
    location: {
        $cond: (string | {
            $ne: string[];
        })[];
    };
    bannerImage: number;
    startDateTime: number;
    endDateTime: number;
    timezone: number;
    capacity: number;
    registeredCount: number;
    isPaid: number;
};
export declare const administrativeResponseData: {
    _id: {
        $toString: string;
    };
    title: number;
    description: number;
    category: number;
    tags: number;
    eventType: number;
    location: {
        $cond: (string | {
            $ne: string[];
        })[];
    };
    bannerImage: number;
    startDateTime: number;
    endDateTime: number;
    timezone: number;
    capacity: number;
    registeredCount: number;
    isPaid: number;
    priceRange: {
        $cond: (string | {
            $eq: (string | boolean)[];
        })[];
    };
    organizer: {
        name: string;
    };
};
