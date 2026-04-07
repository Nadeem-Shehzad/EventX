import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { TicketSagaService } from "./ticket-saga.service";
import { OutboxService } from "src/outbox/outbox.service";
export declare class TicketSagaProcessor extends WorkerHost {
    private readonly sagaService;
    private readonly outboxService;
    constructor(sagaService: TicketSagaService, outboxService: OutboxService);
    process(job: Job): Promise<void>;
    onFailed(job: Job, err: Error): Promise<void>;
    private readonly failureMap;
    private emit;
}
