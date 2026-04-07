import { Document } from "mongoose";
export declare enum EventOutboxStatus {
    PENDING = "PENDING",
    PUBLISHED = "PUBLISHED",
    FAILED = "FAILED"
}
export type EventOutboxDocument = EventOutbox & Document;
export declare class EventOutbox extends Document {
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: Record<string, any>;
    status: EventOutboxStatus;
    retryCount: number;
    lastError: string;
    publishedAt: Date;
}
export declare const EventOutboxSchema: import("mongoose").Schema<EventOutbox, import("mongoose").Model<EventOutbox, any, any, any, (Document<unknown, any, EventOutbox, any, import("mongoose").DefaultSchemaOptions> & EventOutbox & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, EventOutbox, any, import("mongoose").DefaultSchemaOptions> & EventOutbox & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, EventOutbox>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventOutbox, Document<unknown, {}, EventOutbox, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aggregateType?: import("mongoose").SchemaDefinitionProperty<string, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aggregateId?: import("mongoose").SchemaDefinitionProperty<string, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<string, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payload?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<EventOutboxStatus, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    retryCount?: import("mongoose").SchemaDefinitionProperty<number, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastError?: import("mongoose").SchemaDefinitionProperty<string, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date, EventOutbox, Document<unknown, {}, EventOutbox, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventOutbox & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, EventOutbox>;
