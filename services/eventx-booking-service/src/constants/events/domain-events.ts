
export const DOMAIN_EVENTS = {
   // Booking Events
   BOOKING_CREATED: 'booking.created',
   BOOKING_CONFIRM_REQUESTED: 'booking.confirm.requested',
   BOOKING_CONFIRMED: 'booking.confirmed',
   BOOKING_CONFIRM_FAILED: 'booking.confirm.failed',
   BOOKING_CANCELLED: 'booking.cancelled',
   BOOKING_PAYMENT_FAILED: 'booking.payment.failed',

   // Ticket Events
   TICKET_RESERVED: 'tickets.reserved',
   TICKET_RESERVATION_FAILED: 'tickets.reservation.failed',
   
   TICKET_SOLD: 'tickets.sold',
   TICKET_SOLD_FAILED: 'tickets.sold.failed',

   TICKET_FAILED: 'tickets.failed',
   
   // Payment Events
   PAYMENT_REQUEST: 'payment.request',
   PAYMENT_SUCCESS: 'payment.success',
   PAYMENT_FAILED: 'payment.failed',
   PAYMENT_REFUND_REQUEST: 'payment.refund.request',
   BOOKING_PAYMENT_REFUNDED: 'booking.payment.refunded',
};
