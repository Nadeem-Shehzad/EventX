
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
   //reservationId: string;
   isPaid: boolean;
   quantity: number;
}

export interface TicketsReservedFailedPayload {
   bookingId: string;
   reason: string;
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