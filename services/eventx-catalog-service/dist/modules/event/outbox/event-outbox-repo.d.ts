import { ClientSession, Model } from "mongoose";
import { EventOutbox, EventOutboxDocument } from "./event-outbox-schema";
export declare class EventOutboxRepo {
    private readonly outboxModel;
    constructor(outboxModel: Model<EventOutboxDocument>);
    addEvent(aggregateType: string, aggregateId: string, eventType: string, payload: Record<string, any>, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, EventOutboxDocument, {}, import("mongoose").DefaultSchemaOptions> & EventOutbox & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markPublished(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markFailed(eventId: string, error: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): Model<EventOutboxDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, EventOutboxDocument, {}, import("mongoose").DefaultSchemaOptions> & EventOutbox & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, any, EventOutboxDocument>;
}
