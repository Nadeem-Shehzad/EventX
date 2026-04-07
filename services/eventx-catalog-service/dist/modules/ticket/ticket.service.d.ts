import { ClientSession } from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDTO } from './dto/request/create-ticket.dto';
import { TicketTypeDocument } from './schema/ticket-type.schema';
import { LoggerService } from '../../common/logger/logger.service';
export declare class TicketService {
    private readonly ticketRepo;
    private readonly commandBus;
    private readonly queryBus;
    private readonly pinoLogger;
    private readonly logger;
    constructor(ticketRepo: TicketRepository, commandBus: CommandBus, queryBus: QueryBus, pinoLogger: LoggerService);
    createTickets(tickets: CreateTicketDTO[], session: ClientSession): Promise<void>;
    saveTickets(ticket: CreateTicketDTO, session: ClientSession): Promise<TicketTypeDocument>;
    updateOne(id: string, ticketType: Partial<TicketTypeDocument>, sold: number, reserved: number, existingTicket: TicketTypeDocument, session: ClientSession): Promise<void>;
    deleteManyTickets(eventId: string, session: ClientSession): Promise<void>;
    findTicketById(id: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    findConflictingTicketName(eventId: string, name: string, excludeTicketId: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    findTicketByName(eventId: string, name: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    reserveTickets(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument>;
    confirmReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument>;
    releaseReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument>;
    getTicketsByEvent(eventId: string): Promise<any>;
    getTicketByID(ticketTypeId: string): Promise<any>;
    checkAvailability(ticketTypeId: string, quantity: number): Promise<any>;
    findTicketsByEvent(eventId: string): Promise<TicketTypeDocument[]>;
    findByIdNoSession(id: string): Promise<TicketTypeDocument | null>;
}
