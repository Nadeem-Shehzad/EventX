
export class GetTicketsByEventQuery {
   constructor(public readonly eventId: string) { }
}


export class GetTicketByIdQuery {
   constructor(public readonly ticketTypeId: string) { }
}


export class CheckAvailabilityQuery {
   constructor(
      public readonly ticketTypeId: string,
      public readonly quantity: number
   ) { }
}