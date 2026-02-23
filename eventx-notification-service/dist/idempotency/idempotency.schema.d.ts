import { Document } from 'mongoose';
export declare class ProcessedMessage extends Document {
    messageId: string;
    bookingId: string;
    email: string;
    processedAt: Date;
}
export declare const ProcessedMessageSchema: import("mongoose").Schema<ProcessedMessage, import("mongoose").Model<ProcessedMessage, any, any, any, (Document<unknown, any, ProcessedMessage, any, import("mongoose").DefaultSchemaOptions> & ProcessedMessage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ProcessedMessage, any, import("mongoose").DefaultSchemaOptions> & ProcessedMessage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, ProcessedMessage>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    bookingId?: import("mongoose").SchemaDefinitionProperty<string, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    messageId?: import("mongoose").SchemaDefinitionProperty<string, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    processedAt?: import("mongoose").SchemaDefinitionProperty<Date, ProcessedMessage, Document<unknown, {}, ProcessedMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ProcessedMessage>;
