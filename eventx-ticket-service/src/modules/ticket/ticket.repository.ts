import { InjectModel } from "@nestjs/mongoose";
import { TicketTypeDocument } from "./schema/ticket-type.schema";
import { ClientSession, Model, Types } from "mongoose";
import { CreateTicketDTO } from "./dto/request/create-ticket.dto";


export class TicketRepository {

   constructor(@InjectModel('TicketType') private ticketModel: Model<TicketTypeDocument>) { }

   async createTickets(data: CreateTicketDTO[], session: ClientSession) {
      return await this.ticketModel.insertMany(data, { session, ordered: true });
   }


   async ticketReserve(ticketTypeId: string, quantity: number, session?: ClientSession) {
      return await this.ticketModel.findOneAndUpdate(
         {
            _id: ticketTypeId,
            availableQuantity: { $gte: quantity }
         },
         {
            $inc: {
               reservedQuantity: quantity,
               availableQuantity: -quantity
            }
         },
         {
            new: true,
            session
         }
      );
   }



   // public Queries
   async findById(id: string, session: ClientSession) {
      return await this.ticketModel.findById(id).session(session);
   }


   async findOne(eventId: string, name: string, ticketTypeId: string, session: ClientSession) {
      return await this.ticketModel.findOne({
         eventId,
         name,
         _id: { $ne: ticketTypeId }
      }).session(session)
   }


   async findOne2(eventId: string, name: string, session: ClientSession) {
      return await this.ticketModel.findOne({
         eventId,
         name,
      }).session(session)
   }


   async saveTicket(data: any, session: ClientSession) {
      return await this.ticketModel.create(data, { session });
   }


   async updateOne(id: string, ticketType: any, sold: number, reserved: number, existingTicket: any, session: ClientSession) {
      return await this.ticketModel.updateOne(
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
   }

   async deleteManyTickets(eventId: string, session: ClientSession): Promise<any> {
      return await this.ticketModel.deleteMany({ eventId: new Types.ObjectId(eventId) }).session(session);
   }
}