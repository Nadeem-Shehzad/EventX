import { ClientSession } from "mongoose";
import { EventOutboxRepo } from "./event-outbox-repo";
export declare class EventOutboxService {
    private readonly outboxRepo;
    constructor(outboxRepo: EventOutboxRepo);
    addEvent<TPayload extends Record<string, any>>(aggregateType: string, aggregateId: string, eventType: string, payload: TPayload, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, import("./event-outbox-schema").EventOutboxDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event-outbox-schema").EventOutbox & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markPublished(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markFailed(eventId: string, error: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): import("mongoose").Model<import("./event-outbox-schema").EventOutboxDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./event-outbox-schema").EventOutboxDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event-outbox-schema").EventOutbox & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, any, import("./event-outbox-schema").EventOutboxDocument>;
}
