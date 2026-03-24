import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { TicketTypeDocument } from './schema/ticket-type.schema';
import { CreateTicketDTO } from './dto/request/create-ticket.dto';
import { BasePipeline } from 'src/common/base/base.pipeline';
import { throwDbException } from 'src/common/utils/db-error.util';


@Injectable()
export class TicketRepository extends BasePipeline<TicketTypeDocument> {

   constructor(
      @InjectModel('TicketType') private readonly ticketModel: Model<TicketTypeDocument>
   ) {
      super(ticketModel);
   }

   // ── Session-based writes — can't use safeQuery (session lifecycle managed by caller) ──

   async createTickets(data: CreateTicketDTO[], session: ClientSession): Promise<TicketTypeDocument[]> {
      try {
         return await this.ticketModel.insertMany(data, { session, ordered: true }) as unknown as TicketTypeDocument[];
      } catch (err) {
         throwDbException(err, 'TicketRepository.createTickets');
      }
   }

   async saveTicket(data: CreateTicketDTO, session: ClientSession): Promise<TicketTypeDocument> {
      try {
         const result = await this.ticketModel.create([data], { session });
         return result[0];
      } catch (err) {
         throwDbException(err, 'TicketRepository.saveTicket');
      }
   }

   async updateOne(
      id: string,
      ticketType: Partial<TicketTypeDocument>,
      sold: number,
      reserved: number,
      existingTicket: TicketTypeDocument,
      session: ClientSession
   ): Promise<void> {
      try {
         await this.ticketModel.updateOne(
            { _id: id },
            {
               $set: {
                  ...ticketType,
                  availableQuantity:
                     ticketType.totalQuantity !== undefined
                        ? ticketType.totalQuantity - sold - reserved
                        : existingTicket.availableQuantity,
               },
            },
            { session }
         );
      } catch (err) {
         throwDbException(err, 'TicketRepository.updateOne');
      }
   }

   async deleteManyTickets(eventId: string, session: ClientSession): Promise<void> {
      try {
         await this.ticketModel.deleteMany(
            { eventId: new Types.ObjectId(eventId) }
         ).session(session);
      } catch (err) {
         throwDbException(err, 'TicketRepository.deleteManyTickets');
      }
   }

   // ── Ticket reservation — atomic operations, session optional ──

   async ticketReserve(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findOneAndUpdate(
            { _id: ticketTypeId, availableQuantity: { $gte: quantity } },
            { $inc: { reservedQuantity: quantity, availableQuantity: -quantity } },
            { new: true, session }
         );
         // null return = availableQuantity < quantity — caller must handle this
      } catch (err) {
         throwDbException(err, 'TicketRepository.ticketReserve');
      }
   }

   async confirmReservedTickets(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findOneAndUpdate(
            { _id: ticketTypeId, reservedQuantity: { $gte: quantity } },
            { $inc: { reservedQuantity: -quantity, soldQuantity: quantity } },
            { new: true, session }
         );
      } catch (err) {
         throwDbException(err, 'TicketRepository.confirmReservedTickets');
      }
   }

   async releaseReservedTickets(
      ticketTypeId: string,
      quantity: number,
      session?: ClientSession
   ): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findOneAndUpdate(
            { _id: ticketTypeId, reservedQuantity: { $gte: quantity } },
            { $inc: { reservedQuantity: -quantity, availableQuantity: quantity } },
            { new: true, session }
         );
      } catch (err) {
         throwDbException(err, 'TicketRepository.releaseReservedTickets');
      }
   }

   // ── Session-based reads (used inside transactions) ────────────

   async findById(id: string, session: ClientSession): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findById(id).session(session);
      } catch (err) {
         throwDbException(err, 'TicketRepository.findById');
      }
   }

   // Check for duplicate ticket name in event, excluding a specific ticket ID
   async findConflictingTicketName(
      eventId: string,
      name: string,
      excludeTicketId: string,
      session: ClientSession
   ): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findOne({
            eventId,
            name,
            _id: { $ne: excludeTicketId },
         }).session(session);
      } catch (err) {
         throwDbException(err, 'TicketRepository.findConflictingTicketName');
      }
   }

   // Check for duplicate ticket name when creating a new ticket type
   async findTicketByName(
      eventId: string,
      name: string,
      session: ClientSession
   ): Promise<TicketTypeDocument | null> {
      try {
         return await this.ticketModel.findOne({ eventId, name }).session(session);
      } catch (err) {
         throwDbException(err, 'TicketRepository.findTicketByName');
      }
   }

   // ── Non-session reads — full safeQuery pipeline ───────────────

   async findTicketsByEventId(eventId: string): Promise<TicketTypeDocument[]> {
      return this.safeQuery(
         () => this.ticketModel.find({
            eventId: new Types.ObjectId(eventId),
            isActive: true,
         }).lean().exec(),
         {
            fallback: [],  // graceful degradation — listing, not critical
            context: 'TicketRepository.findTicketsByEventId'
         }
      );
   }

   async findByIdNoSession(id: string): Promise<TicketTypeDocument | null> {
      try {
         return await this.safeQuery(
            () => this.ticketModel.findById(id).exec(),
            { context: 'TicketRepository.findByIdNoSession' }
         );
      } catch (err) {
         throwDbException(err, 'TicketRepository.findByIdNoSession');
      }
   }
}