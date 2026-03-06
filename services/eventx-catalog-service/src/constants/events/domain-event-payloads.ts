
// bookings
export interface BookingCreatedPayload {
   bookingId: string;
   userId: string;
   eventId: string;
   ticketTypeId: string;
   quantity: number;
}

export interface BookingConfirmedRequestPayload {
   bookingId: string;
   paymentIntent?: string;
}

export interface BookingConfirmedFailedPayload {
   bookingId: string;
   paymentIntent?: string;
}

export interface BookingConfirmedPayload {
   bookingId: string;
   userId: string;
   eventId: string;
   ticketTypeId: string;
   quantity: number;
}




// tickets
export interface TicketsReservedPayload {
   bookingId: string;
   ticketTypeId: string;
   isPaid: boolean;
   quantity: number;
   price: number
}

export interface TicketsReservedFailedPayload {
   bookingId: string;
   reason: string;
}

export interface TicketsSoldPayload {
   bookingId: string;
   paymentIntent?: string
   // ticketTypeId: string;
   // quantity: number;
}



// payment
export interface PaymentRequestPayload {
   bookingId: string;
   amount: number;
   currency: string;
}

export interface PaymentFailedPayload {
   bookingId: string;
}