import { Document, Types } from 'mongoose';
export type TicketTypeDocument = TicketType & Document;
export declare class TicketType {
    eventId: Types.ObjectId;
    name: string;
    totalQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    soldQuantity: number;
    price: number;
    currency: string;
    isPaidEvent: boolean;
    isActive: boolean;
}
export declare const TicketTypeSchema: import("mongoose").Schema<TicketType, import("mongoose").Model<TicketType, any, any, any, (Document<unknown, any, TicketType, any, import("mongoose").DefaultSchemaOptions> & TicketType & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, TicketType, any, import("mongoose").DefaultSchemaOptions> & TicketType & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, TicketType>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketType, Document<unknown, {}, TicketType, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    eventId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalQuantity?: import("mongoose").SchemaDefinitionProperty<number, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    availableQuantity?: import("mongoose").SchemaDefinitionProperty<number, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reservedQuantity?: import("mongoose").SchemaDefinitionProperty<number, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    soldQuantity?: import("mongoose").SchemaDefinitionProperty<number, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaidEvent?: import("mongoose").SchemaDefinitionProperty<boolean, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, TicketType, Document<unknown, {}, TicketType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TicketType>;
