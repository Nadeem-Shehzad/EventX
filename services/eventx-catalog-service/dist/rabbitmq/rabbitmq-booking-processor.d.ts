import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { TicketService } from '../modules/ticket/ticket.service';
import type { ConsumeMessage } from "amqplib";
export declare class BookingConsumer {
    private readonly ticketService;
    private readonly amqpConnection;
    private readonly logger;
    constructor(ticketService: TicketService, amqpConnection: AmqpConnection);
    handleBookingCreated(eventData: any, amqpMsg: ConsumeMessage): Promise<void>;
}
