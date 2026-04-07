import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { EventOutboxService } from "./event-outbox.service";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
export declare class EventOutboxProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly eventOutboxService;
    private readonly amqpConnection;
    private readonly logger;
    private changeStream;
    constructor(eventOutboxService: EventOutboxService, amqpConnection: AmqpConnection);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startChangeStream;
}
