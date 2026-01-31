import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Queue } from "bullmq";
import { EmailJob } from "src/constants/email-queue.constants";
import { EventService } from "src/modules/event/event.service";
import { UserService } from "src/modules/user/user.service";
import { QUEUES } from "src/queue/queue.constants";


Injectable()
export class BookingEmailListener {

   constructor(
      @InjectQueue(QUEUES.EMAIL)
      private readonly emailQueue: Queue,
      private readonly userService: UserService,
      private readonly eventService: EventService
   ) { }


   @OnEvent(EmailJob.BOOKING_SUCCESS)
   async handleBookingCreated(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {

      const user = await this.userService.getUserById(payload.userId);
      if (!user) return true;

      const event = await this.eventService.findById(payload.eventId);
      if (!event) return true;

      //console.log('inside email listener of booking created');

      await this.emailQueue.add(
         EmailJob.BOOKING_SUCCESS,
         {
            bookingId: payload.bookingId,
            eventName: event.title,
            userName: user.name,
            email: user.email
         },
         {
            attempts: 3,
            backoff: { type: 'exponential', delay: 3000 },
         },
      );
   }


   @OnEvent(EmailJob.BOOKING_CANCEL)
   async handleBookingCancel(payload: {
      bookingId: string,
      eventId: string,
      userId: string
   }) {
      
      console.log('inside email listener of booking cancel');

      const user = await this.userService.getUserById(payload.userId);
      if (!user) return true;

      const event = await this.eventService.findById(payload.eventId);
      if (!event) return true;


      await this.emailQueue.add(
         EmailJob.BOOKING_CANCEL,
         {
            bookingId: payload.bookingId,
            eventName: event.title,
            userName: user.name,
            email: user.email
         },
         {
            attempts: 3,
            backoff: { type: 'exponential', delay: 3000 },
         },
      );

   }


   @OnEvent(EmailJob.BOOKING_FAILED)
   async handleBookingFailed(payload: {
      userId: string,
      reason: string
   }) {

      const user = await this.userService.getUserById(payload.userId);

      await this.emailQueue.add(
         EmailJob.BOOKING_FAILED,
         {
            userId: payload.userId,
            reason: payload.reason,
            email: user?.email
         },
         {
            attempts: 3,
            backoff: { type: 'exponential', delay: 3000 },
         },
      );

   }

}