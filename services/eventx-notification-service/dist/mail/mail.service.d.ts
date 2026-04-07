import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailer;
    constructor(mailer: MailerService);
    sendBookingSuccess({ bookingId, eventName, userName, email }: {
        bookingId: any;
        eventName: any;
        userName: any;
        email: any;
    }): Promise<SentMessageInfo>;
    sendCancelBooking({ bookingId, eventName, userName, email }: {
        bookingId: any;
        eventName: any;
        userName: any;
        email: any;
    }): Promise<SentMessageInfo>;
    sendForgotPassword(email: string, token: string): Promise<SentMessageInfo>;
}
