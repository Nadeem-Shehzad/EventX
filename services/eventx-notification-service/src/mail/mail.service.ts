import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
//import { AppLogger } from 'src/logging/logging.service';


@Injectable()
export class MailService {
   constructor(
      private readonly mailer: MailerService,
      //private readonly logger: AppLogger
   ) { }

   async sendBookingSuccess({ bookingId, eventName, userName, email }) {

      // this.logger.info({
      //    module: 'Mail',
      //    service: MailService.name,
      //    msg: 'Inside sendBookingSuccess',
      //    bookingId: bookingId
      // });

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

      // this.logger.info({
      //    module: 'Mail',
      //    service: MailService.name,
      //    msg: 'Inside sendCancelBooking',
      //    bookingId: bookingId
      // });

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

      // this.logger.info({
      //    module: 'Mail',
      //    service: MailService.name,
      //    msg: 'Inside sendForgotPassword',
      //    email
      // });

      return this.mailer.sendMail({
         to: email,
         subject: 'Reset your password',
         template: 'forgot-password',
         context: { token },
      });
   }
}