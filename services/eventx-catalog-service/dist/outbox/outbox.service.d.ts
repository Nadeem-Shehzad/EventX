import { OutboxRepo } from "./outbox.repo";
import { ClientSession } from "mongoose";
export declare class OutboxService {
    private readonly outboxRepo;
    constructor(outboxRepo: OutboxRepo);
    addEvent<TPayload extends Record<string, any>>(aggregateType: string, aggregateId: string, eventType: string, payload: TPayload, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findPending(): Promise<(import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markDispatched(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markPublished(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): import("mongoose").Model<import("./outbox.schema").OutboxEventDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, any, import("./outbox.schema").OutboxEventDocument>;
}
