import { Expose, Transform, Type } from "class-transformer";
import { TicketTypeDto } from "../request/create-event.dto";
import { ApiProperty } from "@nestjs/swagger";


export class LocationResponseDTO {
   @Expose()
   @ApiProperty({ example: 'Expo Center' })
   venueName: string;

   @Expose()
   @ApiProperty({ example: 'Wapda Town' })
   address: string;

   @Expose()
   @ApiProperty({ example: 'Lahore' })
   city: string;

   @Expose()
   @ApiProperty({ example: 'Pakistan' })
   country: string;

   @Expose()
   @ApiProperty({ example: 123.456 })
   latitude: number;

   @Expose()
   @ApiProperty({ example: 146.321 })
   longitude: number;
}


export class BannerImageResponseDTO {
   @Expose()
   @ApiProperty({ example: 'http://example.com/eventx.gif' })
   url: string;

   @Expose()
   @ApiProperty({ example: 'eventx/123456' })
   publicId: string;
}


export class EventResponseDTO {
   // @Expose()
   // readonly id: string;
   @Expose()
   @Transform(({ obj }) => obj._id.toString())
   @ApiProperty({ example: 'asjdalskdjalsdk9687' })
   _id: string;

   @Expose()
   @ApiProperty({ example: 'Mega event launch' })
   readonly title: string

   @Expose()
   @ApiProperty({ example: 'In expo center lahore there is an event.' })
   readonly description: string

   @Expose()
   @ApiProperty({ example: 'tech' })
   readonly category: string

   @Expose()
   @ApiProperty({ example: ['tech', 'expo'] })
   readonly tags: string[];

   @Expose()
   @ApiProperty({ example: 'Offline' })
   readonly eventType: string

   @Expose()
   @Transform(({ obj }) => {
      if (obj.eventType === 'offline' || obj.eventType === 'hybrid') {
         return obj.location;
      }
      return undefined;
   })
   @ApiProperty({ type: LocationResponseDTO })
   readonly location?: LocationResponseDTO

   @Expose()
   @Type(() => BannerImageResponseDTO)
   @ApiProperty({ type: BannerImageResponseDTO })
   readonly bannerImage: BannerImageResponseDTO

   @Expose()
   @ApiProperty({ example: '2026-03-10T18:00:00Z' })
   readonly startDateTime: Date

   @Expose()
   @ApiProperty({ example: '2026-03-10T18:00:00Z' })
   readonly endDateTime: Date

   @Expose()
   @ApiProperty({ example: 'Karachi/Asia' })
   readonly timezone: string

   @Expose()
   @ApiProperty({ example: 50 })
   readonly capacity: number

   @Expose()
   @ApiProperty({ example: 20 })
   readonly registeredCount: number

   @Expose()
   @ApiProperty({ example: true })
   readonly isPaid: boolean

   @Expose()
   ticketTypes?: TicketTypeDto[];
}