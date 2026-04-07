import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PaymentSagaService } from "./payment-saga.service";
import { OutboxService } from "src/outbox/outbox.service";
import { AppLogger } from "src/logging/logging.service";
export declare class PaymentSagaProcessor extends WorkerHost {
    private readonly sagaService;
    private readonly outboxService;
    private readonly logger;
    constructor(sagaService: PaymentSagaService, outboxService: OutboxService, logger: AppLogger);
    process(job: Job): Promise<void>;
    onFailed(job: Job, err: Error): Promise<void>;
    private readonly failureMap;
    private emit;
}
