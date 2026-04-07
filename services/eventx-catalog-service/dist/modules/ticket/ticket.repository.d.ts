import { ClientSession, Model } from 'mongoose';
import { TicketTypeDocument } from './schema/ticket-type.schema';
import { CreateTicketDTO } from './dto/request/create-ticket.dto';
import { BasePipeline } from 'src/common/base/base.pipeline';
export declare class TicketRepository extends BasePipeline<TicketTypeDocument> {
    private readonly ticketModel;
    constructor(ticketModel: Model<TicketTypeDocument>);
    createTickets(data: CreateTicketDTO[], session: ClientSession): Promise<TicketTypeDocument[]>;
    saveTicket(data: CreateTicketDTO, session: ClientSession): Promise<TicketTypeDocument>;
    updateOne(id: string, ticketType: Partial<TicketTypeDocument>, sold: number, reserved: number, existingTicket: TicketTypeDocument, session: ClientSession): Promise<void>;
    deleteManyTickets(eventId: string, session: ClientSession): Promise<void>;
    ticketReserve(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument | null>;
    confirmReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument | null>;
    releaseReservedTickets(ticketTypeId: string, quantity: number, session?: ClientSession): Promise<TicketTypeDocument | null>;
    findById(id: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    findConflictingTicketName(eventId: string, name: string, excludeTicketId: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    findTicketByName(eventId: string, name: string, session: ClientSession): Promise<TicketTypeDocument | null>;
    findTicketsByEventId(eventId: string): Promise<TicketTypeDocument[]>;
    findByIdNoSession(id: string): Promise<TicketTypeDocument | null>;
}
