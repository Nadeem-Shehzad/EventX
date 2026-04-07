import { Queue } from "bullmq";
import { OutboxService } from "./outbox.service";
export declare class OutboxDispatcher {
    private readonly outboxService;
    private ticketQueue;
    private bookingQueue;
    private paymentQueue;
    private isProcessing;
    private changeStream;
    private readonly logger;
    constructor(outboxService: OutboxService, ticketQueue: Queue, bookingQueue: Queue, paymentQueue: Queue);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startChangeStream;
    private processEvent;
    private jobOptions;
}
