
export class ReserveTicketCommand {
   constructor(
      public readonly ticketTypeId: string,
      public readonly quantity: number,
      public readonly session?: any
   ) { }
}


export class ConfirmTicketCommand {
   constructor(
      public readonly ticketTypeId: string,
      public readonly quantity: number,
      public readonly session?: any,
   ) { }
}


export class ReleasedReservedTicketCommand {
   constructor(
      public readonly ticketTypeId: string,
      public readonly quantity: number,
      public readonly session?: any,
   ) { }
}