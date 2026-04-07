import { OutboxRepo } from "./outbox.repo";
import { ClientSession } from "mongoose";
export declare class OutboxService {
    private readonly outboxRepo;
    constructor(outboxRepo: OutboxRepo);
    addEvent<TPayload extends Record<string, any>>(aggregateType: string, aggregateId: string, eventType: string, payload: TPayload, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, {}> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findPending(): Promise<(import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, {}> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markDispatched(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markPublished(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): import("mongoose").Model<import("./outbox.schema").OutboxEventDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./outbox.schema").OutboxEventDocument, {}, {}> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
}
