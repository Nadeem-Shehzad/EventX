import { Model } from 'mongoose';
import { ProcessedMessage } from './idempotency.schema';
export declare class IdempotencyService {
    private readonly processedMessageModel;
    private readonly logger;
    constructor(processedMessageModel: Model<ProcessedMessage>);
    tryMarkAsProcessing(messageId: string, metadata: {
        bookingId: string;
        email: string;
    }): Promise<boolean>;
    deleteRecord(messageId: string): Promise<void>;
}
