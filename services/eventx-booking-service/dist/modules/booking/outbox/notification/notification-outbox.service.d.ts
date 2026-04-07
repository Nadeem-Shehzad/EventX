import { ClientSession } from "mongoose";
import { NotificationOutboxRepo } from "./notification-outbox.repo";
export declare class NotificationOutboxService {
    private readonly outboxRepo;
    constructor(outboxRepo: NotificationOutboxRepo);
    addEvent<TPayload extends Record<string, any>>(aggregateType: string, aggregateId: string, eventType: string, payload: TPayload, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, import("./notification-outbox.schema").NotificationOutboxDocument, {}, {}> & import("./notification-outbox.schema").NotificationOutbox & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markPublished(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markFailed(eventId: string, error: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): import("mongoose").Model<import("./notification-outbox.schema").NotificationOutboxDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./notification-outbox.schema").NotificationOutboxDocument, {}, {}> & import("./notification-outbox.schema").NotificationOutbox & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
}
