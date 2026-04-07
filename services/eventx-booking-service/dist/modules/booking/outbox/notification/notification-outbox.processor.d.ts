import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { NotificationOutboxService } from "./notification-outbox.service";
export declare class NotificationOutboxProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly notificationOutboxService;
    private readonly amqpConnection;
    private readonly logger;
    private changeStream;
    constructor(notificationOutboxService: NotificationOutboxService, amqpConnection: AmqpConnection);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startChangeStream;
}
