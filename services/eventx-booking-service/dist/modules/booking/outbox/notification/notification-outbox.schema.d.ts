import { Document } from "mongoose";
export declare enum NotificationOutboxStatus {
    PENDING = "PENDING",
    PUBLISHED = "PUBLISHED",
    FAILED = "FAILED"
}
export type NotificationOutboxDocument = NotificationOutbox & Document;
export declare class NotificationOutbox extends Document {
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: Record<string, any>;
    status: NotificationOutboxStatus;
    retryCount: number;
    lastError: string;
    publishedAt: Date;
}
export declare const NotificationOutboxSchema: import("mongoose").Schema<NotificationOutbox, import("mongoose").Model<NotificationOutbox, any, any, any, Document<unknown, any, NotificationOutbox, any, {}> & NotificationOutbox & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationOutbox, Document<unknown, {}, import("mongoose").FlatRecord<NotificationOutbox>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationOutbox> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
