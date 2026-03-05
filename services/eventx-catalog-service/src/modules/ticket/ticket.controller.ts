import { Controller } from "@nestjs/common";


@Controller({ path: 'ticket', version: '1' })
export class TicketController {

   // 3 - POST /v1/tickets/validate

   // - reserve ticket
   // - confirm tickets ... called after payment success ... reserve to sold
   // - release tickets ... called after payment  failed ... release reserved tickets
}