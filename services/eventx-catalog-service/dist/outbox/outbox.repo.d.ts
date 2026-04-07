import { ClientSession, Model } from "mongoose";
import { OutboxEventDocument } from "./outbox.schema";
export declare class OutboxRepo {
    private outboxModel;
    constructor(outboxModel: Model<OutboxEventDocument>);
    addEvent(aggregateType: string, aggregateId: string, eventType: string, payload: any, session?: ClientSession): Promise<(import("mongoose").Document<unknown, {}, OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findPending(): Promise<(import("mongoose").Document<unknown, {}, OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markDispatched(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    markPublished(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getModel(): Model<OutboxEventDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, OutboxEventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./outbox.schema").OutboxEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, any, OutboxEventDocument>;
}
