import { Controller } from "@nestjs/common";


@Controller({ path: 'ticket', version: '1' })
export class TicketController {


   // 1 - GET /v1/tickets/:ticketId
   // 2 - GET /v1/events/:eventId/tickets
   // 3 - POST /v1/tickets/validate
   // 4 - GET /v1/tickets/stats/event/:eventId
   // 5 - PATCH /v1/tickets/:ticketId

}