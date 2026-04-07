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
export declare const OutboxSchema: import("mongoose").Schema<OutboxEvent, import("mongoose").Model<OutboxEvent, any, any, any, (Document<unknown, any, OutboxEvent, any, import("mongoose").DefaultSchemaOptions> & OutboxEvent & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, OutboxEvent, any, import("mongoose").DefaultSchemaOptions> & OutboxEvent & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, OutboxEvent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OutboxEvent, Document<unknown, {}, OutboxEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aggregateType?: import("mongoose").SchemaDefinitionProperty<string, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aggregateId?: import("mongoose").SchemaDefinitionProperty<string, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<string, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payload?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<OutboxStatus, OutboxEvent, Document<unknown, {}, OutboxEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OutboxEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OutboxEvent>;
