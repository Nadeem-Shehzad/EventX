import { Queue } from "bullmq";
import { OutboxService } from "./outbox.service";
export declare class OutboxDispatcher {
    private readonly outboxService;
    private bookingQueue;
    private ticketQueue;
    private isProcessing;
    private changeStream;
    private readonly logger;
    constructor(outboxService: OutboxService, bookingQueue: Queue, ticketQueue: Queue);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startChangeStream;
    private processEvent;
    private jobOptions;
}
