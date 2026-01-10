import { Expose, Transform, Type } from "class-transformer";
import { TicketTypeDto } from "./create-event.dto";


export class LocationResponseDTO {
   @Expose()
   venueName: string;

   @Expose()
   address: string;

   @Expose()
   city: string;

   @Expose()
   country: string;

   @Expose()
   latitude: number;

   @Expose()
   longitude: number;
}

export class BannerImageResponseDTO {
   @Expose()
   url: string;

   @Expose()
   publicId: string;
}


export class EventResponseDTO {
   // @Expose()
   // readonly id: string;
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   _id: string;

   @Expose()
   readonly title: string

   @Expose()
   readonly description: string

   @Expose()
   readonly category: string

   @Expose()
   readonly tags: string[];

   @Expose()
   readonly eventType: string

   @Expose()
   @Transform(({ obj }) => {
      if (obj.eventType === 'offline' || obj.eventType === 'hybrid') {
         return obj.location;
      }
      return undefined;
   })
   readonly location?: LocationResponseDTO

   @Expose()
   @Type(() => BannerImageResponseDTO)
   readonly bannerImage: BannerImageResponseDTO

   @Expose()
   readonly startDateTime: Date

   @Expose()
   readonly endDateTime: Date

   @Expose()
   readonly timezone: string

   @Expose()
   readonly capacity: number

   @Expose()
   readonly registeredCount: number

   @Expose()
   readonly isPaid: boolean

   @Expose()
   ticketTypes?: TicketTypeDto[];
}