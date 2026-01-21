import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailService {
   constructor(private readonly mailer: MailerService) { }

   async sendBookingSuccess({ bookingId, eventName, userName, email }) {
      console.log('inside mail booking success service');

      return this.mailer.sendMail({
         to: email,
         subject: 'Event Booked Success',
         html: `
         <h2>Welcome in ${eventName} Event</h2>
         <p>Hi ${userName}. You booked ticket for ${eventName} event successfully.</p>
         `
      });
   }

   async sendCancelBooking({ bookingId, eventName, userName, email }) {
      console.log('inside mail booking cancel service');

      return this.mailer.sendMail({
         to: email,
         subject: 'Payment Refunded',
         html: `
         <h2>Event ${eventName} Booking Cancelled</h2>
         <p>Hi ${userName}. Your ticket booking for ${eventName} event cancelled and refunded successfully.</p>
         `
      });
   }

   async sendForgotPassword(email: string, token: string) {
      return this.mailer.sendMail({
         to: email,
         subject: 'Reset your password',
         template: 'forgot-password',
         context: { token },
      });
   }
}