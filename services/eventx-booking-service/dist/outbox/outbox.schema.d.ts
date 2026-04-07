import { Document } from "mongoose";
export declare enum OutboxStatus {
    PENDING = "PENDING",
    DISPATCHED = "DISPATCHED ",
    PUBLISHED = "PUBLISHED"
}
export type OutboxEventDocument = OutboxEvent & Document;
export declare class OutboxEvent extends Document {
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: Record<string, any>;
    status: OutboxStatus;
}
export declare const OutboxSchema: import("mongoose").Schema<OutboxEvent, import("mongoose").Model<OutboxEvent, any, any, any, Document<unknown, any, OutboxEvent, any, {}> & OutboxEvent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OutboxEvent, Document<unknown, {}, import("mongoose").FlatRecord<OutboxEvent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OutboxEvent> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
