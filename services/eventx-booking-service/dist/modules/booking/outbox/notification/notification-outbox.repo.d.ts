import { ClientSession, Model } from "mongoose";
import { NotificationOutbox, NotificationOutboxDocument } from "./notification-outbox.schema";
export declare class NotificationOutboxRepo {
    private readonly outboxModel;
    constructor(outboxModel: Model<NotificationOutboxDocument>);
    addEvent(aggregateType: string, aggregateId: string, eventType: string, payload: Record<string, any>, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, NotificationOutboxDocument, {}, {}> & NotificationOutbox & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markPublished(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markFailed(eventId: string, error: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): Model<NotificationOutboxDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, NotificationOutboxDocument, {}, {}> & NotificationOutbox & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
}
