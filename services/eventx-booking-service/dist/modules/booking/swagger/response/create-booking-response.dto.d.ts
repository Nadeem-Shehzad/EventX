declare class PaymentData {
    paymentIntentId: string;
    clientSecret: string | null;
}
export declare class CreateBookingResponseDTO {
    bookingId: string;
    userId: string;
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    status: string;
    amount: number;
    currency: string;
    confirmedAt: Date;
    payment: PaymentData;
}
export {};
