import { ApiProperty } from "@nestjs/swagger";


class PaymentData {
   @ApiProperty({ example: 'pi_fdkjh435jhkasjh' })
   paymentIntentId: string;

   @ApiProperty({ example: 'sec_fdkjh435fkjsdh' })
   clientSecret: string | null
}


export class CreateBookingResponseDTO {
   @ApiProperty({ example: 'sdjfhskdjfhskdjfh765' })
   bookingId: string;

   @ApiProperty({ example: 'sdjfhskdjfhskdjfhasf' })
   userId: string;

   @ApiProperty({ example: 'sdjfhskdjfhskdjasdas' })
   eventId: string;

   @ApiProperty({ example: 'sdjfhskdjfhskdjet567' })
   ticketTypeId: string;

   @ApiProperty({ example: 2 })
   quantity: number;

   @ApiProperty({ example: 'PENDING' })
   status: string;

   @ApiProperty({ example: 1000 })
   amount: number;

   @ApiProperty({ example: 'PKR' })
   currency: string;

   @ApiProperty({ example: '' })
   confirmedAt: Date

   @ApiProperty({ type: PaymentData })
   payment: PaymentData
}